import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Slide, Modal, Chip } from '@mui/material';
import { FaFilter } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";

import Button from '../Button';
import { toast } from 'react-toastify';

export default function CreateOrUpdate({
  openButton,
  itemName,
  itemOptions,
  itemIdKey,
  groupName,
  groupOptions,
  groupIdKey,
  groupObject=null,
  createFunction,
  updateFunction,
  autoInclude=null
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selection, setSelection] = useState(groupObject ? 'addTo' : '');
  const [selectedGroup, setSelectedGroup] = useState(groupObject);
  const [name, setName] = useState(groupObject ? groupObject.name : '');
  const [newIncluded, setNewIncluded] = useState(groupObject ? groupObject[`${itemName.toLowerCase()}s`].map(itemObj => itemObj[itemIdKey]) : []);
  const [excludedFilter, setExcludedFilter] = useState('');
  const [includedFilter, setIncludedFilter] = useState('');

  const handleClose = () => {
    if (groupObject) {
      setNewIncluded(groupObject[`${itemName.toLowerCase()}s`].map(itemObj => itemObj[itemIdKey]));
    } else {
      setSelection('');
      setSelectedGroup(null);
      setName('');
      setNewIncluded([]);
    }
    setModalVisible(false);
  }

  const handleOpen = () => {
    setModalVisible(true);
  };

  const handleSelection = (newSelection) => {
    if (newSelection === 'create' && autoInclude) {
      setNewIncluded([autoInclude]);
    }
    setSelection(newSelection);
  };

  const handleSelectGroup = (e) => {
    const newSelectedGroup = groupOptions.find(opt => String(opt[groupIdKey]) === e.target.value);

    setName(newSelectedGroup.name);
    setSelectedGroup(newSelectedGroup);

    const groupIncluded = newSelectedGroup[`${itemName.toLowerCase()}s`].map(item => item[itemIdKey]);
    if (autoInclude) {
      groupIncluded.push(autoInclude);
    }
    setNewIncluded(groupIncluded);
  };

  const handleSubmit = async () => {
    let wasSuccessful;
    let actionName;
    if (selectedGroup) {
      wasSuccessful = await updateFunction({ ...selectedGroup, [`${itemName.toLowerCase()}s`]: newIncluded });
      actionName = 'updated';
    } else {
      // Validate inputs...must have at least one item and a name
      let cancel = false;
      if (!name.trim()) {
        toast.error(`A name is required to create a ${groupName.toLowerCase()}.`);
        cancel = true;
      }
      if (newIncluded.length === 0) {
        toast.error(`You must select at least one ${itemName.toLowerCase()} to create a ${groupName.toLowerCase()}.`);
        cancel = true;
      }

      if (cancel) return;

      wasSuccessful = await createFunction(name, newIncluded);
      actionName = 'created';
    }
    
    if (wasSuccessful) {
      toast.success(`${groupName} ${actionName} successfully!`);
      handleClose();
    }
  };

  const generateChipsColumn = (items, handleClick, filterStateValue, filterSetStateFn, showNothing) => {
    let renderItems = items.filter(item => item.includes(filterStateValue));
    if (itemName === 'Sample') {
      renderItems = renderItems.map(itemId => {
        const itemObj = itemOptions.find(opt => opt[itemIdKey] === itemId);
        return {
          label: `...${itemId.slice(-4)} (${itemObj.timestamp})`,
          value: itemId
        };
      });
    } else {
      renderItems = renderItems.map(itemId => ({ value: itemId, label: '...' + itemId.slice(-7) }))
    }
    return (
      <div className='flex flex-col min-h-36 max-h-[50vh] w-[calc(50%-16px)] overflow-y-auto border border-gray-500'>
        {showNothing ?
          <></> :
          <>
            {items.length >= 15 &&
              <div className='relative border-b border-gray-300 rounded-none bg-gray-100'>
                <div className='absolute top-2.5 left-1'>
                  <FaFilter />
                </div>
                <input
                  className="appearance-none w-full py-2 pl-5 pr-6 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="text"
                  placeholder=""
                  value={filterStateValue}
                  onChange={e => filterSetStateFn(e.target.value)}
                />
                {filterStateValue &&
                  <Button
                    onClick={() => filterSetStateFn('')}
                    className='absolute top-[7px] right-1'
                    variant='icon'
                  ><IoMdCloseCircle /></Button>
                }
              </div>
            }
            {renderItems.map(({ value, label }, i) => 
              <div key={value + String(i)} className='my-0.5'>
                <Chip
                  label={label}
                  onClick={() => handleClick(value)}
                  sx={{
                    height: 'auto',
                    '& .MuiChip-label': {
                      display: 'block',
                      whiteSpace: 'normal',
                    },
                  }}
                />
              </div>
            )}
          </>
        }
      </div>
    );
  };

  const generateChangeList = () => {
    let currentItems = [];
    if (selectedGroup) {
      currentItems = selectedGroup[`${itemName.toLowerCase()}s`].map(item => item[itemIdKey]);
    }

    const added = newIncluded.filter(newItem => !currentItems.includes(newItem));
    const removed = currentItems.filter(currItem => !newIncluded.includes(currItem));

    if (added.length === 0 && removed.length === 0) {
      return <></>;
    }
    
    return (
      <div>
        <h4 className='underline text-black text-lg text-center mt-2'>Change List</h4>

        <div>
          {added.length ? (
            <>
              <h5 className='font-bold'>Adding:</h5>
              <ul>
                {added.map(id => <li key={id} className='ml-4'>...{id.slice(-7)}</li>)}
              </ul>
            </>
          ) : (
            <></>
          )}
        </div>

        <div>
          {removed.length ? (
            <>
              <h5 className='font-bold'>Removing:</h5>
              <ul>
                {removed.map(id => <li key={id} className='ml-4'>...{id.slice(-7)}</li>)}
              </ul>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    );
  };
  
  const moveToIncluded = (newItem) => {
    setNewIncluded([...newIncluded, newItem]);
  };

  const removeFromIncluded = (removeItem) => {
    setNewIncluded(newIncluded.filter(item => item !== removeItem));
  };

  return (
    <>
      <Modal
        open={modalVisible}
        onClose={handleClose}
        closeAfterTransition
      >
        <Slide in={modalVisible}>
          <div className='flex-1 justify-center items-center max-w-sm m-auto mt-[25vh]'>
            <div className='shadow-lg m-5 bg-white rounded-2xl px-3 py-5 flex flex-col gap-2 items-center'>
              {selection ? (
                <div className='w-full'>
                  <div className="mb-3">
                    {selection === 'addTo' ? (
                      <>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="item-select">
                          Choose a {groupName} to Update:
                        </label>
                        <select
                          className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          id="item-select"
                          value={selectedGroup ? selectedGroup[groupIdKey] : ''}
                          onChange={handleSelectGroup}
                          disabled={Boolean(groupObject)}
                        >
                          <option disabled value=''> -- Select -- </option>
                          {groupOptions.map(opt => {
                            if (opt.samples.some(s => s.sampleID === autoInclude)) {
                              return <React.Fragment key={opt[groupIdKey]}></React.Fragment>;
                            } else {
                              return (
                                <option key={opt[groupIdKey]} value={opt[groupIdKey]}>
                                  {opt.name}
                                </option>
                              );
                            }
                          })}
                        </select>
                      </>
                    ) : (
                      <>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                          New {groupName} Name
                        </label>
                        <input
                          className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          type="text"
                          placeholder='Example #1'
                          value={name}
                          onChange={e => setName(e.target.value)}
                          id='name'
                        />
                      </>
                    )}
                  </div>
            
                  <div className='flex items-stretch justify-evenly h-fit'>
                    <div className='w-[calc(50%-16px)]'><p className='text-center'>Excluded {itemName}s</p></div>
                    <div className='w-8'><p></p></div>
                    <div className='w-[calc(50%-16px)]'><p className='text-center'>Included {itemName}s</p></div>
                  </div>
                  
                  <div className='flex items-stretch justify-between h-fit'>
                    {generateChipsColumn(itemOptions.filter(opt => !newIncluded.includes(opt[itemIdKey])).map(opt => opt[itemIdKey]), moveToIncluded, excludedFilter, setExcludedFilter, selection === 'addTo' && selectedGroup === null)}
            
                    <div className='text-2xl leading-2 w-8 self-center text-center'>
                      <p>&rarr;</p>
                      <p>&larr;</p>
                    </div>
            
                    {generateChipsColumn(newIncluded, removeFromIncluded, includedFilter, setIncludedFilter, selection === 'addTo' && selectedGroup === null)}
                  </div>

                  <div>
                    {generateChangeList()}
                  </div>
                  
                  <div className='flex justify-end mt-4 gap-2'>
                    <Button
                      onClick={handleClose}
                      variant='cancel'
                    >Cancel</Button>

                    <Button
                      onClick={handleSubmit}
                      variant='small'
                    >Submit</Button>
                  </div>
                </div>
              ) : (
                <div className='flex flex-col gap-6 pt-4'>
                  <Button
                    onClick={() => handleSelection('create')}
                  >Create New {groupName}</Button>
    
                  <Button
                    onClick={() => handleSelection('addTo')}
                  >Add to Existing {groupName}</Button>        
                </div>
              )}
            </div>
          </div>
        </Slide>
      </Modal>
      {openButton(handleOpen)}
    </>
  );
}

CreateOrUpdate.propTypes = {
  openButton: PropTypes.func,
  itemName: PropTypes.string,
  itemOptions: PropTypes.array,
  itemIdKey: PropTypes.string,
  groupName: PropTypes.string,
  groupOptions: PropTypes.array,
  groupIdKey: PropTypes.string,
  groupObject: PropTypes.object,
  createFunction: PropTypes.func,
  updateFunction: PropTypes.func,
  autoInclude: PropTypes.string,
};