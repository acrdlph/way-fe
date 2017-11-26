import React from 'react';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import './image-selection-modal.less';
import {showModal, setImage, uploadImage} from '../stores/profileImageStore';

const isValidFileName = filename => {
  return filename.endsWith('.jpg') || filename.endsWith('.png');
};

// src: https://stackoverflow.com/questions/19032406/convert-html5-canvas-into-file-to-be-uploaded
const canvas2Blob = canvas => {
  const canvasData = canvas.toDataURL();
  var blobBin = atob(canvasData.split(',')[1]);
  var array = [];
  for(var i = 0; i < blobBin.length; i++) {
      array.push(blobBin.charCodeAt(i));
  }
  return new Blob([new Uint8Array(array)], {type: 'image/png'});
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

    if(isValidFileName(this.fileInput.value)) {
      this.setState({invalidFile:false});
      const that = this;
      let data = this.fileInput.files[0];
      const fileName = data.name;
      const previewImage = document.getElementById('img-preview');
      const filereader = new FileReader();
      filereader.onload = function (event) {
        previewImage.onload = function (event) {
          const canvas = document.getElementById('img-preview-canvas');
          const ctx = canvas.getContext("2d");
          let sx, sy, sw, sh;
          const smallerSideLength = Math.min(previewImage.width, previewImage.height);
          if(previewImage.width === smallerSideLength) {
            sx = 0;
            sw = previewImage.width;
            sy = 0.5 * (previewImage.height - previewImage.width);
            sh = previewImage.width;
          } else {
            sx = 0.5 * (previewImage.width - previewImage.height);
            sw = previewImage.height;
            sy = 0;
            sh = previewImage.height;
          }
          ctx.drawImage(previewImage, sx, sy, sw, sh, 0, 0, 100, 100);
          const file = canvas2Blob(canvas);
          that.props.setImage({fileName, data: file});
        };
        previewImage.src = event.target.result;
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
              <canvas width='100' height='100' id='img-preview-canvas' className='image-selection-canvas'/>
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
