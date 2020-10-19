import React from 'react';
import Modal from 'react-modal';

interface uploadModalState {
  modalIsOpen: boolean;
  closeModal: any;
  fileUpdate: any;
  fileUpload: any;
  selectedFile: any;
}

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#2a2b47',
    border: 'none',
  },
  overlay: {
    backgroundColor: 'rgba(12, 12, 17, 0.75)',
  },
};

Modal.setAppElement('#root');

const UploadModal: React.FC<uploadModalState> = (props: uploadModalState) => {
  return (
    <div>
      <Modal
        id="upload-modal"
        isOpen={props.modalIsOpen}
        onRequestClose={props.closeModal}
        style={customStyles}
        contentLabel="Upload Modal"
      >
        <h1>UPLOAD YOUR SCHEMA DESIGN</h1>
        <p>.SQR AND .TAR FORMAT ONLY</p>
        <form
          id="upload-form"
          action="/upload"
          method="post"
          encType="multipart/form-data"
        >
          <input type="file" name="myFile" onChange={props.fileUpdate} />
        </form>
        <button
          className="primary-button"
          type="button"
          onClick={props.fileUpload}
        >
          Import File!
        </button>
        <button className="secondary-button" onClick={props.closeModal}>
          Cancel
        </button>
      </Modal>
    </div>
  );
};

export default UploadModal;
