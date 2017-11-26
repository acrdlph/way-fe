import React from 'react';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import './image-selection-modal.less';
import {showModal, setImage, uploadImage} from '../stores/profileImageStore';

const isValidFileName = filename => {
  return filename.endsWith('.jpg') || filename.endsWith('.png');
};

class ImageSelection extends React.Component {

  constructor(props) {
    super(props);
    this.selectFile = this.selectFile.bind(this);
    this.uploadImage = this.uploadImage.bind(this);
    this.onChangeFile = this.onChangeFile.bind(this);
    this.state = {
      invalidFile: false
    };
  }

  selectFile() {
    this.fileInput.click();
  }

  uploadImage() {
    this.props.uploadImage({fileName: this.props.isImageSelected, data: this.props.data});
    this.props.onUpload ? this.props.onUpload() : null;
    this.props.close();
  }

  onChangeFile() {
    const fileName = this.fileInput.value;
    if(isValidFileName(fileName)) {
      this.setState({invalidFile:false});
      const that = this;
      const data = this.fileInput.files[0];
      const previewImage = document.getElementById('img-preview');
      const filereader = new FileReader();
      filereader.onload = function (event) {
        previewImage.src = event.target.result;
        that.props.setImage({fileName, data});
      };
      filereader.readAsDataURL(data);
    } else {
      this.setState({invalidFile: true});
    }
  }

  render() {
    const {invalidFile} = this.state;
    const okButton = (
      <button onClick={this.uploadImage}>OK</button>
    );
    const errorMessage = invalidFile ? 'Please select an image file!' : null;
    return (
      <div>
        <Modal
          isOpen={true}
          contentLabel="Modal"
        >
          <div>
            <p>Upload your profile photo</p>
            <input
              type='file'
              ref={(input) => this.fileInput=input}
              style={{display: 'none'}}
              onChange={this.onChangeFile}
            />
            <button onClick={this.selectFile}>Select file</button>
            <div className='image-selection-preview'>
              <img id='img-preview'/>
            </div>
            {errorMessage}
            {this.props.isImageSelected ? okButton : null}
            <button onClick={this.props.close}>Cancel</button>
          </div>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isImageSelected: state.profileImage.fileName,
  data: state.profileImage.data,
});

const mapDispatchToProps = dispatch => ({
  close: () => {
    dispatch(showModal(false));
    dispatch(setImage(null, null)); // unset image
  },
  setImage: (fileName, data) => dispatch(setImage(fileName, data)),
  uploadImage: (fileName, data) => dispatch(uploadImage(fileName, data))
});

export default connect(mapStateToProps, mapDispatchToProps)(ImageSelection);
