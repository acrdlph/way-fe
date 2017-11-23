import React from 'react';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import './image-selection-modal.less';
import {showModal, setImage} from '../stores/profileImageStore';

const isValidFileName = filename => {
  return filename.endsWith('.jpg') || filename.endsWith('.png');
};

class ImageSelection extends React.Component {

  constructor(props) {
    super(props);
    this.selectFile = this.selectFile.bind(this);
    this.onChangeFile = this.onChangeFile.bind(this);
    this.state = {
      invalidFile: false
    };
  }

  selectFile() {
    this.fileInput.click();
  }

  onChangeFile() {
    const fileName = this.fileInput.value;
    if(isValidFileName(fileName)) {
      this.setState({invalidFile:false});
      const that = this;
      const file = this.fileInput.files[0];
      const previewImage = document.getElementById('img-preview');
      const filereader = new FileReader();
      filereader.onload = function (event) {
        const data = event.target.result;
        previewImage.src = data;
        that.props.setImage({fileName, data});
      };
      filereader.readAsDataURL(file);
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
            {this.props.isImageSeleced ? okButton : null}
            <button onClick={this.props.close}>Cancel</button>
          </div>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isImageSeleced: state.profileImage.fileName,
  data: state.profileImage.data,
});

const mapDispatchToProps = dispatch => ({
  close: () => {
    dispatch(showModal(false));
    dispatch(setImage(null, null)); // unset image
  },
  setImage: (fileName, data) => dispatch(setImage(fileName, data))
});

export default connect(mapStateToProps, mapDispatchToProps)(ImageSelection);
