import React from 'react';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
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
      <div className='image-selection-button'>
        <RaisedButton
          onClick={this.uploadImage}
          backgroundColor='#ffd801'
          label='OK'
        />
      </div>
    );
    const errorMessage = invalidFile ? 'Please select an image file!' : null;
    return (
      <div className='image-selection'>
        <Modal
          isOpen={true}
          contentLabel="Modal"
        >
          <div>
            <h4>Upload your profile photo</h4>
            <input
              type='file'
              ref={(input) => this.fileInput=input}
              style={{display: 'none'}}
              onChange={this.onChangeFile}
            />
            <div className='image-selection-button'>
              <RaisedButton
                onClick={this.selectFile}
                backgroundColor='#ffd801'
                label='Select file'
                style={{overflow: 'hidden'}}
              />
            </div>
            <div className='image-selection-preview'>
              <img id='img-preview'/>
            </div>
            {errorMessage}
            {this.props.isImageSelected ? okButton : null}
            <div className='image-selection-button image-selection-button-cancel'>
              <RaisedButton
                onClick={this.props.close}
                backgroundColor='#ffd801'
                label='Cancel'
              />
            </div>
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
