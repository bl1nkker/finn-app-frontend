import React, { useEffect, useState } from 'react'
import './pagesStyles/importerModal.css'

// Redux
import { useSelector, useDispatch } from 'react-redux'
import { createImporter, fetchImporters, removeImporter, updateImporter } from '../redux/actions/importersActions'
import Backdrop from '../components/confirmationWindow/Backdrop'
import ImporterModal from '../components/imports/importerModal/ImporterModal'
import ImportersHeader from '../components/imports/ImportersHeader'
import ImportersDataRow from '../components/imports/ImportersDataRow'

function Imports() {
  const dispatch = useDispatch()
  const importers = useSelector(state => state.importers.data)

  const [showImporterModal, setShowImporterModal] = useState(false)
  const [selectedImporter, setSelectedImporter] = useState(null)
  // create/edit/idle
  const [modalMethod, setModalMethod] = useState('idle')
  const [formError, setFormError] = useState(false)

  const handleCloseImporterModal = () =>{
    setSelectedImporter(null)
    setModalMethod('idle')
    setShowImporterModal(false);
    setFormError(false)
  }

  const handleOpenImporterModal = (method, Importer) =>{
    setSelectedImporter(Importer)
    setModalMethod(method)
    setShowImporterModal(true);
  }

  const handleSendImporter = (formData) =>{
    // { company_name: "", bank_name: "", correspondent_account: "", 
    // inn: "", bik: "", expense_account: "", production_type: "", 
    // custom_production_type: "empty", comment: "", is_deleted: true, 
    // facility: 1}
    if (!formData.company_name || !formData.bank_name || !formData.correspondent_account ||
      !formData.inn || !formData.bik || !formData.expense_account ||
      !formData.production_type || !formData.comment || !formData.facility )
      setFormError(true)
    else{
      if (modalMethod === "edit") {
          const editedData = {...formData, custom_production_type: 'empty'}
          dispatch(updateImporter(editedData, formData.id))
          console.log(`Editing Importer...:`, editedData);
      }
      else if (modalMethod === "create") {
          dispatch(createImporter(formData))
          console.log(`Adding Importer...:`, formData);
      }
      setSelectedImporter(null)
      setModalMethod('idle')
      setShowImporterModal(false);
      window.location.reload()
    }
  }

  const handleDeleteImporter = (formData) =>{
    dispatch(removeImporter(formData.id))
    console.log('Deleting Importer...:', formData);
    setSelectedImporter(null)
    setModalMethod('idle')
    setShowImporterModal(false);
    window.location.reload()
  }

  useEffect(() =>{
    dispatch(fetchImporters())
  }, [dispatch])
  return (
    <div className='table_container'>
      {showImporterModal && <>
                <Backdrop />
                <ImporterModal 
                formError={formError}
                handleDeleteImporter={handleDeleteImporter} 
                modalMethod={modalMethod} 
                handleSendImporter={handleSendImporter} 
                handleCloseImporterModal={handleCloseImporterModal} 
                selectedImporter={selectedImporter}/>
            </>}
      <ImportersHeader handleOpenImporterModal={handleOpenImporterModal}/>
      {importers.map((importer, key) => <ImportersDataRow handleOpenImporterModal={handleOpenImporterModal} key={key} importer={importer}/>)}
    </div>
  )
}

export default Imports
