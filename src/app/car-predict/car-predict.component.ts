import { Component, OnInit, Renderer2} from '@angular/core';
import '@tensorflow/tfjs-backend-cpu';
import '@tensorflow/tfjs-backend-webgl';
import * as automl from '@tensorflow/tfjs-automl';


@Component({
  selector: 'app-car-predict',
  templateUrl: './car-predict.component.html',
  styleUrls: ['./car-predict.component.css']
})
export class CarPredictComponent implements OnInit {
  
  TEMP_FILE: any;
  model: automl.ObjectDetectionModel;

  constructor(private renderer:Renderer2) { }

  ngOnInit() {
    this.loadModel();
  }
  
  updateSvg() {
    const image = document.getElementById('image-upload');
    const svg = document.querySelector('svg');
    svg.setAttribute('width', <string><unknown>image.clientWidth);
    svg.setAttribute('height', <string><unknown>image.clientHeight);
  }
  
  readImage(files) {
    this.resetSvg();    
    if (files && files[0]) {
      var reader = new FileReader()

      reader.onload = function (loadEvent) {
        document.getElementById('image-upload').setAttribute( 'src', <string>loadEvent.target.result);
      }
      reader.readAsDataURL(files[0])
      this.TEMP_FILE = files[0]
    }
  }

  async loadModel() {
    const MODEL_URL ='/assets/models/car-predict/model.json';
    this.model = await automl.loadObjectDetection(MODEL_URL);
  }

  async predict(){
    const image = document.getElementById('image-upload');
    const options = { score: 0.5, iou: 0.5, topk: 20 };
    const predictions = await this.model.detect(<automl.ImageInput>image, options);
    
    this.drawBoxes(predictions);
  }

  drawBoxes(predictions) {
    this.updateSvg();
    const svg = document.querySelector('svg');
    if (predictions != 0) {
      predictions.forEach(prediction => {
        const { box, label, score } = prediction;
        const { left, top, width, height } = box;
        const rect = this.renderer.createElement('rect', 'svg')
        this.renderer.addClass(rect, 'box');
        this.renderer.setAttribute(rect, 'width', width);
        this.renderer.setAttribute(rect, 'height', height);
        this.renderer.setAttribute(rect, 'x', left);
        this.renderer.setAttribute(rect, 'y', top);
        const text = this.renderer.createElement('text', 'svg')
        this.renderer.addClass(text, 'label');
        this.renderer.setAttribute(text, 'x', left + width / 2);
        this.renderer.setAttribute(text, 'y', top);
        this.renderer.setAttribute(text, 'dy', '12');
        text.textContent = `${label}: ${score.toFixed(3)}`;
        svg.appendChild(rect);
        svg.appendChild(text);
        const textBBox = text.getBBox();
        const textRect = this.renderer.createElement('rect', 'svg')
        this.renderer.addClass(textRect, 'label-rect');
        this.renderer.setAttribute(textRect, 'x', <string>textBBox.x);
        this.renderer.setAttribute(textRect, 'y', <string>textBBox.y);
        this.renderer.setAttribute(textRect, 'width', <string>textBBox.width);
        this.renderer.setAttribute(textRect, 'height', <string>textBBox.height);
        svg.insertBefore(textRect, text);
      });
    }
  }

  resetSvg(){
    const svg = document.querySelector('svg');
    const text = document.querySelector('text');
    this.renderer.setAttribute(svg, 'width', '0');
    this.renderer.setAttribute(svg, 'height', '0');
    var rect = document.getElementsByTagName("rect"), index;
    for (index = rect.length - 1; index >= 0; index--) {
      rect[index].parentNode.removeChild(rect[index]);
    }
    if(text != null)
      text.remove();
  }

}
