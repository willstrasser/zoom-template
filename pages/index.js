import classNames from 'classnames';
import {useState} from 'react';
import html2canvas from 'html2canvas';
import {Button} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import CancelIcon from '@material-ui/icons/Cancel';

import styles from '../styles/Zoom.module.scss';

const ASPECT_RATION = 5 / 7;
const LAYOUT_WIDTH = 100;
const LAYOUT_HEIGHT = LAYOUT_WIDTH * ASPECT_RATION;
const OUTPUT_WIDTH = 4000;

export default function Zoom() {
  const onSave = () => {
    const zoomFactor = OUTPUT_WIDTH / window.visualViewport.width;
    const grid = document.querySelector('#grid');
    grid.style.width = `${zoomFactor * LAYOUT_WIDTH}vw`;
    grid.style.height = `${zoomFactor * LAYOUT_HEIGHT}vw`;
    document.body.style.fontSize = `${zoomFactor}rem`;
    html2canvas(grid, {
      allowTaint: true,
      scale: 1,
      ignoreElements: (element) => element.tagName === 'INPUT',
      imageTimeout: 0,
    }).then(function (canvas) {
      const image = canvas
        .toDataURL('image/png')
        .replace('image/png', 'image/octet-stream');
      var a = document.createElement('a');
      a.href = image;
      a.download = 'output.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      const grid = document.querySelector('#grid');
      grid.style.width = `${LAYOUT_WIDTH}vw`;
      document.querySelector('#grid').style.height = `${LAYOUT_HEIGHT}vw`;
      document.body.style.fontSize = '1rem';
    });
  };
  const array = Array.apply(null, Array(12)).map(function () {});
  return (
    <>
      <div className={styles.grid} id="grid">
        {array.map((item, index) => (
          <Cell key={index} index={index} />
        ))}

        <img src="/chrome.png" className={styles.chrome} />
      </div>
      <div className={styles.exportButton}>
        <Button variant="contained" color="primary" onClick={onSave}>
          Export
        </Button>
      </div>
    </>
  );
}

const Cell = ({index}) => {
  const [files, setFiles] = useState([]);
  const [name, setName] = useState('');
  const id = `icon-button-file-${index}`;
  return (
    <div className={classNames(styles.cell, {[styles.bottomRow]: index > 7})}>
      {!files.length > 0 && (
        <div className={styles.upload}>
          <input
            className={styles.input}
            onChange={() => {
              setFiles(event.target.files);
            }}
            type="file"
            id={id}
            accept="image/*"
          ></input>
          <label htmlFor={id}>
            <IconButton aria-label="upload picture" component="span">
              <PhotoCamera fontSize="large" />
            </IconButton>
          </label>
        </div>
      )}
      {Array.from(files).map((file) => {
        return (
          <>
            <div
              className={styles.image}
              style={{
                background: `transparent url("${URL.createObjectURL(
                  file
                )}") no-repeat center center/cover`,
              }}
            >
              <div className={styles.closeButton}>
                <IconButton
                  onClick={() => setFiles([])}
                  aria-label="remove picture"
                  component="span"
                >
                  <CancelIcon />
                </IconButton>
              </div>
            </div>
            {name && <div className={styles.nameDisplay}>{name}</div>}
            <input
              className={styles.nameInput}
              value={name}
              onChange={() => setName(event.target.value)}
              placeholder="Enter name"
            />
          </>
        );
      })}
    </div>
  );
};
