import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import './Modal.css';

function Modal() {
  const [modal, setModal] = useState(false);
  const toggleModal = () => {
    setModal(!modal);
  };

  const [selectedSchema, setSelectedSchema] = useState(null);
  const [addedSchemas, setAddedSchemas] = useState([]);
  const [segmentName, setSegmentName] = useState('');

  const schemaOptions = [
    { label: 'First Name', value: 'first_name' },
    { label: 'Last Name', value: 'last_name' },
    { label: 'Gender', value: 'gender' },
    { label: 'Age', value: 'age' },
    { label: 'Account Name', value: 'account_name' },
    { label: 'City', value: 'city' },
    { label: 'State', value: 'state' },
  ];

  const handleDropdownChange = (event, index) => {
    const selectedValue = event.target.value;

    // Update the selected schema with the new value
    const updatedSchemas = addedSchemas.map((schema, i) =>
      i === index ? selectedValue : schema
    );

    setAddedSchemas(updatedSchemas);
    setSelectedSchema(null);
  };

  const handleAddNewSchemaClick = (event) => {
    event.preventDefault(); // Prevent form submission

    if (selectedSchema && !addedSchemas.includes(selectedSchema)) {
      setAddedSchemas([...addedSchemas, selectedSchema]);
      setSelectedSchema(null);
    }
  };

  const handleSaveSegmentClick = async (event) => {
    event.preventDefault();

    const formattedSegmentName = segmentName.replace(/\s+/g, '_').toLowerCase();
    const segmentData = {
      segment_name: formattedSegmentName,
      schema: addedSchemas.map((schema) => ({ [schema]: getLabelForSchema(schema) })),
    };

    try {
      const response = await fetch('https://webhook.site/93668c89-726d-4e47-bcb2-8880cf5a9652', {
        method: 'POST',
        mode: 'no-cors', // Set the request mode to 'no-cors'
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(segmentData),
      });

      console.log(response); // Log the response for debugging

      // if (!response.ok) {
      //   throw new Error(`HTTP error! Status: ${response.status}`);
      // }

      setSegmentName('');
      setAddedSchemas([]);
      setSelectedSchema(null);

      const responseData = await response.json();
      console.log('Request sent successfully:', responseData);
    } catch (error) {
      console.error('Error sending data to webhook:', error);
    }

  };

  // Function to get the label for a given schema value
  const getLabelForSchema = (schemaValue) => {
    const foundSchema = schemaOptions.find((schema) => schema.value === schemaValue);
    return foundSchema ? foundSchema.label : schemaValue;
  };


  return (
    <>

      <div className='main-header'>
        <button className='close-modal'>
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <h2>View Audience</h2>
      </div>
      
      <button onClick={toggleModal} className='btn-modal'>
        Save Segment
      </button>

      {modal && (
        <div className='modal'>
          <div className='overlay' onClick={toggleModal}></div>
          <div className='modal-content'>
            <div className='modal-header'>
              <button className='close-modal' onClick={toggleModal}>
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
              <h2>Saving Segment</h2>
            </div>
            <div className='modal-body'>
              <form>
                <div className='row'>
                  <label htmlFor='segmentName'>Enter the name of segment</label>
                  <input
                    type='text'
                    id='segmentName'
                    placeholder='Name of the segment'
                    value={segmentName}
                    onChange={(e) => setSegmentName(e.target.value)}
                  />
                </div>

                <div>
                  <p>To save your segment, you need to add the schemas to build the query</p>
                </div>

                <div className='blueBox'>
                  {addedSchemas.map((addedSchema, index) => (
                    <div className='row' key={index}>
                      {/* New dropdown for each added schema */}
                      <select
                        value={addedSchema}
                        onChange={(event) => handleDropdownChange(event, index)}
                      >
                        {/* Display all schema options in the dropdown */}
                        {schemaOptions.map((schema, optionIndex) => (
                          <option key={optionIndex} value={schema.value}>
                            {schema.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>

                <div className='row'>
                  <select
                    className='schemaDropdown'
                    id='schemaDropdown'
                    onChange={(event) => setSelectedSchema(event.target.value)}
                    value={selectedSchema || ''}
                  >
                    <option value='' disabled>
                      Add schema to segment
                    </option>
                    {schemaOptions.map((schema, index) => (
                      !addedSchemas.includes(schema.value) && (
                        <option key={index} value={schema.value}>
                          {schema.label}
                        </option>
                      )
                    ))}
                  </select>


                  <a href='#' className='addNewSchema-btn' onClick={handleAddNewSchemaClick}>
                    + Add new schema
                  </a>
                </div>

                <button onClick={handleSaveSegmentClick} className='save-btn'>Save the Segment</button>
                <button type='button' onClick={toggleModal} className='cancel-btn'>
                  Cancel
                </button>
              </form>

            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Modal;
