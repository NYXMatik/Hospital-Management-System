// src/app/services/three-viewer.service.ts
import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

@Injectable({
  providedIn: 'root'
})
export class ThreeViewerService {
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private textures: any = {};

  constructor() {
    this.initScene();
    this.loadTextures();
  }

  private initScene() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer();
    
    // Initialize lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7);
    
    this.scene.add(ambientLight);
    this.scene.add(directionalLight);
    
    this.camera.position.set(5, 15, 15);
    this.camera.lookAt(5, 0, 5);
  }

  private loadTextures(): void {
    const textureLoader = new THREE.TextureLoader();
    this.textures = {
      0: textureLoader.load('assets/Render3D/Resources/floor.png'),
      1: textureLoader.load('assets/Render3D/Resources/wall_texture.jpg'),
      2: textureLoader.load('assets/Render3D/Resources/wall_texture.jpg'),
      3: textureLoader.load('assets/Render3D/Resources/wall_texture.jpg'),
      4: textureLoader.load('assets/Render3D/Resources/wall_texture.jpg'),
      5: textureLoader.load('assets/Render3D/Resources/door_original.jpg'),
      6: textureLoader.load('assets/Render3D/Resources/door_original.jpg'),
      7: textureLoader.load('assets/Render3D/Resources/door_original.jpg'),
      8: textureLoader.load('assets/Render3D/Resources/door_original.jpg'),
      9: textureLoader.load('assets/Render3D/Resources/floor.png'),
    };
  }

  // Add other methods from script.js
}