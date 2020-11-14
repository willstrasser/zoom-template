import {useState} from 'react';
import html2canvas from 'html2canvas';

export default function Zoom() {
  const onSave = (() =>{
    document.querySelector("#grid").style.width='600vw';
    document.querySelector("#grid").style.height='300vw';
    document.body.style.fontSize='5rem';
    html2canvas(document.querySelector("#grid"), {
      allowTaint: true,
      scale: 1,
      ignoreElements: (element) => element.tagName === 'input',
  }).then(function(canvas) {
      const image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
      var a = document.createElement('a');
      a.href = image;
      a.download = "output.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      document.querySelector("#grid").style.width='100vw';
      document.querySelector("#grid").style.height='50vw';
      document.body.style.fontSize='1rem';
    });
  })
  const array = Array.apply(null, Array(12)).map(function () {})
  return(
    <>
      <div style={{
        height: '71.4vw',
        width: '100vw',
        display: 'grid',
        gridTemplateColumns: '25% 25% 25% 25%',
        gridTemplateRows: '33.33% 33.33% 33.33%',
        border: '.1em solid black',
        position: 'relative',
        background: 'rgba(0,0,0,.5)'
      }} id="grid">
        {array.map((item, index) => <Cell key={index}/>)}

        <img src="/chrome.png" style={{
          width: '100%',
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0
        }}/>
      </div>
      <div style={{position: 'absolute', background: 'green', top:0, padding:10}} onClick={onSave}>Save</div>
    </>
  );
}

const Cell = () => {
  const [files, setFiles] = useState([]);
  const [name, setName] = useState('');
  const onChange = (e) => {
    setFiles(event.target.files);
  }
  return (
    <div style={{width: '100%', height: '100%', border: '.1em solid black', position:'relative'}}>
      {!files.length > 0 && <input style={{position: 'absolute'}} onChange={onChange} type="file" accept="image/*"></input>}
      {Array.from(files).map(file=>{
        return (
          <div 
            style={{
              width: '100%', 
              height: '100%', 
              background: `transparent url("${URL.createObjectURL(file)}") no-repeat center center/cover`
            }}
          >
            <div onClick={()=>setFiles([])} style={{position:'absolute', right: 0}}>x</div>
          </div>
        );
        })}
        <input
          value={name}
          placeholder="Enter name here"
          onChange={(e) => setName(e.value)}
          style={{
            width: '100%',
            padding: '.3em',
            position:'absolute', 
            bottom: 0, 
            color: 'white', 
            background:'rgba(0,0,0,.75)', 
            border:'none',
            backgroundImage:'none',
            boxShadow: 'none',
            fontSize: '1em',
          }}
        />
    </div>
  );
}