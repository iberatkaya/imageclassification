import React, { Component } from 'react';
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import './App.css';

/**
 * A simple React App to test image recognition models MobileNet and COCOSSD
 *
 * @author iberatkaya
 */

interface Props {

};

/**
 * State of the React App
 * 
 * @property {string} image The file path of the image
 * @property {boolean} loading To check if the models have loaded
 * @property {mobilenet.MobileNet} modelMobilenet The MobileNet model 
 * @property {cocoSsd.DetectedObject} modelCocoSsd The COCO-SSD model
 * @property {Array<object>} mobilenetPred The predictions of the MobileNet model,
 * @property {Array<object>} cocossdPred The predictions of the COCO-SSD model,
 * @property {boolean} scanned To check if the image was scanned
 */

interface State {
  image: string,
  loading: boolean,
  modelMobilenet: mobilenet.MobileNet | null,
  modelCocoSsd: cocoSsd.ObjectDetection | null,
  mobilenetPred: Array<object>,
  cocossdPred: Array<object>,
  scanned: boolean
}


class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      image: '',
      loading: true,
      modelMobilenet: null,
      modelCocoSsd: null,
      mobilenetPred: [],
      cocossdPred: [],
      scanned: false
    }
  }

  async componentDidMount() {
    // Load the model.
    const modelMobilenet = await mobilenet.load({ version: 1, alpha: 1 });
    const modelCocoSsd = await cocoSsd.load();
    this.setState({ modelMobilenet, modelCocoSsd, loading: false });
  }


  onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let file = URL.createObjectURL(e.target.files![0]);
    this.setState({ image: file })
  }


  render() {
    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark static-top">
          <div className="container">
            <a className="navbar-brand">Image Class Detection</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarResponsive">
              <ul className="navbar-nav ml-auto">
                <li className="nav-item active">
                  <a className="nav-link" target="_blank" href="https://github.com/iberatkaya">Github</a>
                </li>
                <li className="nav-item active">
                  <a className="nav-link" target="_blank" href="https://linkedin.com/in/ibrahim-berat-kaya/">LinkedIn</a>
                </li>
                <li className="nav-item active">
                  <a className="nav-link" target="_blank" href="https://www.npmjs.com/package/@tensorflow-models/mobilenet">MobileNet</a>
                </li>
                <li className="nav-item active">
                  <a className="nav-link" target="_blank" href="https://www.npmjs.com/package/@tensorflow-models/coco-ssd">COCO-SSD</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <div className="container">
          <div className="row">
            <div className="col-lg-12 text-center">
              <h2 className="m-3">Tenserflow.js Image Classification</h2>
            </div>
          </div>
        </div>

        {this.state.loading ?
          <div className="container text-center">
            <div className="spinner-border text-danger mb-3" role="status">
            </div>
            <div className="lead">Loading Models...</div>
          </div>
          :
          <div>
            {
              this.state.image === '' ?
                <div className="container justify-center align-items-center">
                  <div className="text-center">
                    <p className="lead">Upload your image to classify it. Images are clasified with the MobileNet and COCO-SSD models.</p>
                  </div>
                  <form className="w-75 form">
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">Upload</span>
                      </div>
                      <div className="custom-file">
                        <input value={this.state.image} onChange={this.onChange} accept="image/*" type="file" className="custom-file-input" />
                        <label className="custom-file-label">Choose file</label>
                      </div>
                    </div>
                  </form>
                </div>
                :

                <div className="container-fluid">
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="text-center">
                        <img ref="image" style={{ maxWidth: '60%' }} className="img-responsive" src={this.state.image}></img>
                      </div>
                      <p></p> {/* Moves button to bottom of image */}
                      {!this.state.scanned ?
                        <div className="text-center">
                          <button className="btn btn-outline-primary" onClick={async () => {
                            const modelMobilenet = this.state.modelMobilenet;
                            const modelCocoSsd = this.state.modelCocoSsd;
                            const predmobilenet = await modelMobilenet!.classify(this.refs.image as HTMLImageElement);
                            const predcocossd = await modelCocoSsd!.detect(this.refs.image as HTMLImageElement);
                            console.log(predmobilenet);
                            console.log(predcocossd);
                            this.setState({ mobilenetPred: predmobilenet, cocossdPred: predcocossd, scanned: true });

                          }}>Scan</button>
                        </div>
                        :
                        <div className="container">
                          <ul className="list-group">
                            <li className="list-group-item disabled">MobileNet</li>
                            {this.state.mobilenetPred.map((i: any) => {
                              return <li className="list-group-item">Prediction: {i.className} - Probability: {parseFloat(i.probability).toFixed(3)}</li>
                            })}
                            <li className="list-group-item disabled">COCO-SSD</li>
                            {this.state.cocossdPred.map((i: any) => {
                              return <li className="list-group-item">Prediction: {i.class} - Probability: {parseFloat(i.score).toFixed(3)}</li>
                            })}
                          </ul>
                          <div className="text-center">
                            <button className="btn btn-outline-primary" onClick={async () => {
                              this.setState({image: '', mobilenetPred: [], cocossdPred: [], scanned: false})
                            }}>Scan New Image</button>
                          </div>
                        </div>
                      }
                    </div>
                  </div>
                </div>
            }
          </div>
        }
      </div>
    )
  }
}

export default App
