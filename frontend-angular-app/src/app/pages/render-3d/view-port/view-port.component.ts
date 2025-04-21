import { CommonModule } from '@angular/common';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { InformationPanelComponent } from '../information-panel/information-panel.component';
import { HostListener } from '@angular/core';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import * as TWEEN from '@tweenjs/tween.js';

import {
  Component,
  ElementRef,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { AppComponent } from '../../../app.component';

interface TimeSlot {
  startTime: string;
  endTime: string;
  activity: string;
}

interface RoomInfo {
  RoomId: string;
  specialization: string;
  schedule: TimeSlot[];
}

interface RoomLayout {
  BuildingName: string;
  BuildingFloor: string;
  BuildingXSize: string;
  BuildingYSize: string;
  BedIDList: string[];
  Layout: (number | string)[];
}

@Component({
  selector: 'app-three-renderer',
  templateUrl: './view-port.component.html',
  styleUrls: ['./view-port.component.css'],
  standalone: true,
  imports: [CommonModule, InformationPanelComponent, ReactiveFormsModule],
})
export class ThreeRendererComponent
  implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('rendererContainer', { static: true })
  rendererContainer!: ElementRef;
  BedIDList: string[] = []; 

  roomInfo: RoomInfo | null = null;
  showInfoPanel = false;
  showInfoPanel2 = true;
  currentLayout: RoomLayout | null = null;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private objLoader = new OBJLoader();
  private textures: Record<number, THREE.Texture> = {};
  private animationId!: number;

  TILE_SIZE = 1;
  WALL_HEIGHT = 1.5;
  WALL_THICKNESS = 0.1;

  private controls!: OrbitControls;

  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();
  private selectedBed: THREE.Object3D | null = null;

	private originalBedColor: THREE.Color | null = null;
	private selectedRoomId: string | null = null;
	roomInfoForm: FormGroup;

  	constructor(private fb: FormBuilder) {
    this.roomInfoForm = this.fb.group({
      RoomId: [''],
      specialization: [''],
      startTime: [''],
      endTime: [''],
      activity: ['']
    });
  }
	// Add click event listener
	@HostListener('window:click', ['$event'])
	onClick(event: MouseEvent): void {
		// Calculate mouse position in normalized device coordinates
		this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

		// Update the picking ray with the camera and mouse position
		this.raycaster.setFromCamera(this.mouse, this.camera);

		// Calculate objects intersecting the picking ray
		const intersects = this.raycaster.intersectObjects(this.scene.children, true);

		// Find the first bed object that was clicked
		const bedIntersect = intersects.find(intersect =>
			intersect.object.parent?.userData['type'] === 'bed'
		);

		if (bedIntersect) {
			this.selectBed(bedIntersect.object.parent!);
		} else {
			this.deselectBed();
		}
	}

	ngOnInit(): void {
		this.loadTextures();
	}

	ngAfterViewInit(): void {
		this.initScene();
		this.animate();
    	this.addSpotlight();

  }

	ngOnDestroy(): void {
		// Stop the animation loop
		cancelAnimationFrame(this.animationId);
		// Dispose of Three.js resources
		this.clearScene();
		this.renderer.dispose();
	}
	newRoomInfo: RoomInfo = {
		RoomId: '',
		specialization: '',
		schedule: []
	  };
	  
	  newTimeSlot: TimeSlot = {
		startTime: '',
		endTime: '',
		activity: ''
	  };
	  addTimeSlot(): void {
		this.newRoomInfo.schedule.push({ ...this.newTimeSlot });
		this.newTimeSlot = { startTime: '', endTime: '', activity: '' };
	  }
	  
	  createRoomInfo(): void {
		this.newRoomInfo.RoomId = this.roomInfoForm.value.RoomId;
		this.newRoomInfo.specialization = this.roomInfoForm.value.specialization;
		this.newTimeSlot.startTime = this.roomInfoForm.value.startTime;
		this.newTimeSlot.endTime = this.roomInfoForm.value.endTime;
		this.newTimeSlot.activity = this.roomInfoForm.value.activity;
		this.addTimeSlot();
	  
		const roomInfoJson = JSON.stringify(this.newRoomInfo, null, 2);
		console.log(this.newRoomInfo);

		const blob = new Blob([roomInfoJson], { type: 'application/json' });
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `${this.newRoomInfo.RoomId}.json`;
		a.click();
		window.URL.revokeObjectURL(url);
		this.resetRoomInfoForm();
	  }
	  
	  resetRoomInfoForm(): void {
		this.newRoomInfo = {
		  RoomId: '',
		  specialization: '',
		  schedule: []
		};
		this.newTimeSlot = { startTime: '', endTime: '', activity: '' };
		this.roomInfoForm.reset();
	  }
	/*private initScene(): void {
		// Create the scene
		this.scene = new THREE.Scene();

		// Set up the camera
		this.camera = new THREE.PerspectiveCamera(
			60,
			window.innerWidth / window.innerHeight,
			0.1,
			1000
		);
		this.camera.position.set(5, 15, 15);
		this.camera.lookAt(5, 0, 5);

		// Set up the renderer
		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);

		// Add lights
		const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
		this.scene.add(ambientLight);

		const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
		directionalLight.position.set(5, 10, 7);
		this.scene.add(directionalLight);
	}*/

	private initScene(): void {
		// Create the scene
		this.scene = new THREE.Scene();

		// Set up the camera
		this.camera = new THREE.PerspectiveCamera(
			60,
			window.innerWidth / window.innerHeight,
			0.1,
			1000
		);
		this.camera.position.set(5, 15, 15);
		this.camera.lookAt(5, 0, 5);

		// Set up the renderer
		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);

		// Configure camera controls
		this.controls = new OrbitControls(this.camera, this.renderer.domElement);
		this.controls.enableDamping = true; // Smooth animation
		this.controls.dampingFactor = 0.05;
		this.controls.enablePan = true;
		this.controls.enableZoom = true;

		// Add lights
		const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
		this.scene.add(ambientLight);

		const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
		directionalLight.position.set(5, 10, 7);
		this.scene.add(directionalLight);

		// Handle window resize
		window.addEventListener('resize', () => this.onWindowResize());
	}

	private onWindowResize(): void {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	}
	// Show error messages to the user
	private showError(message: string): void {
		alert(`Error: ${message}`);
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

	private createFloorTile(x: number, y: number): void {
		const geometry = new THREE.PlaneGeometry(this.TILE_SIZE, this.TILE_SIZE);
		geometry.rotateX(-Math.PI / 2);
		const material = new THREE.MeshStandardMaterial({ map: this.textures[0] });
		const floorTile = new THREE.Mesh(geometry, material);
		floorTile.position.set(x * this.TILE_SIZE, 0, y * this.TILE_SIZE);
		this.scene.add(floorTile);
	}

	private createTile(type: number | string, x: number, y: number): void {
		// Early return for beds
		if (this.currentLayout?.BedIDList.includes(type as string)) {
			this.objLoader.load(
				'assets/Render3D/Resources/Bed.obj',
				(obj) => {
					obj.position.set(x * this.TILE_SIZE, 0.1, y * this.TILE_SIZE);
					console.log('Bed position:', obj.position);
					obj.scale.set(0.5, 0.5, 0.5);
					obj.userData = {
						type: 'bed',
						bedId: type,
						RoomId: type,
					};
					this.scene.add(obj);
				},
				undefined,
				(error) => console.error('Error loading .obj model:', error)
			);
			return;
		}

		// Handle walls and doors
		if ([1, 2, 3, 4, 5, 6, 7, 8].includes(Number(type))) {
			const geometry = new THREE.BoxGeometry(
				this.TILE_SIZE + this.WALL_THICKNESS,
				this.WALL_HEIGHT,
				this.WALL_THICKNESS
			);
			const material = new THREE.MeshStandardMaterial({
				map: this.textures[Number(type)],
			});
			const tile = new THREE.Mesh(geometry, material);
			tile.position.set(x * this.TILE_SIZE, this.WALL_HEIGHT / 2, y * this.TILE_SIZE);

			switch (Number(type)) {
				case 1: // North wall
				case 5: // North door
					tile.position.z += this.TILE_SIZE / 2;
					break;
				case 2: // East wall
				case 6: // East door
					tile.rotation.y = -Math.PI / 2;
					tile.position.x += this.TILE_SIZE / 2;
					break;
				case 3: // South wall
				case 7: // South door
					tile.rotation.y = Math.PI;
					tile.position.z -= this.TILE_SIZE / 2;
					break;
				case 4: // West wall
				case 8: // West door
					tile.rotation.y = Math.PI / 2;
					tile.position.x -= this.TILE_SIZE / 2;
					break;
			}
			this.scene.add(tile);
			return;
		}

		// Handle corners
		if (['a', 'b', 'c', 'd'].includes(type as string)) {
			const cornerGeometry = new THREE.BoxGeometry(
				this.TILE_SIZE + this.WALL_THICKNESS,
				this.WALL_HEIGHT,
				this.WALL_THICKNESS
			);
			const material = new THREE.MeshStandardMaterial({
				map: this.textures[1],
			});
			const tile1 = new THREE.Mesh(cornerGeometry, material);
			const tile2 = new THREE.Mesh(cornerGeometry, material);

			switch (type) {
				case 'a': // NE Corner
					tile1.position.set(x * this.TILE_SIZE, this.WALL_HEIGHT / 2, y * this.TILE_SIZE + this.TILE_SIZE / 2);
					tile2.position.set(x * this.TILE_SIZE + this.TILE_SIZE / 2, this.WALL_HEIGHT / 2, y * this.TILE_SIZE);
					tile2.rotation.y = -Math.PI / 2;
					break;
				case 'b': // SE Corner
					tile1.position.set(x * this.TILE_SIZE, this.WALL_HEIGHT / 2, y * this.TILE_SIZE - this.TILE_SIZE / 2);
					tile2.position.set(x * this.TILE_SIZE + this.TILE_SIZE / 2, this.WALL_HEIGHT / 2, y * this.TILE_SIZE);
					tile2.rotation.y = -Math.PI / 2;
					break;
				case 'c': // SW Corner
					tile1.position.set(x * this.TILE_SIZE, this.WALL_HEIGHT / 2, y * this.TILE_SIZE - this.TILE_SIZE / 2);
					tile2.position.set(x * this.TILE_SIZE - this.TILE_SIZE / 2, this.WALL_HEIGHT / 2, y * this.TILE_SIZE);
					tile2.rotation.y = Math.PI / 2;
					break;
				case 'd': // NW Corner
					tile1.position.set(x * this.TILE_SIZE, this.WALL_HEIGHT / 2, y * this.TILE_SIZE + this.TILE_SIZE / 2);
					tile2.position.set(x * this.TILE_SIZE - this.TILE_SIZE / 2, this.WALL_HEIGHT / 2, y * this.TILE_SIZE);
					tile2.rotation.y = Math.PI / 2;
					break;
			}
			this.scene.add(tile1);
			this.scene.add(tile2);
		}
	}
	private clearScene(): void {
		// Remove all objects from the scene
		while (this.scene.children.length > 0) {
			const child = this.scene.children[0];

			// Dispose of geometries and materials
			if ((child as THREE.Mesh).isMesh) {
				const mesh = child as THREE.Mesh;
				mesh.geometry.dispose();
				if (mesh.material instanceof THREE.Material) {
					mesh.material.dispose();
				}
			}

			this.scene.remove(child);
		}
	}

	private animate(): void {
		this.animationId = requestAnimationFrame(() => this.animate());
		TWEEN.update(); // Update the tween animations
		this.updateSpotlight(); // Update spotlight position
		this.renderer.render(this.scene, this.camera);
	}


  private convertLayoutToGrid(layout: RoomLayout): (number | string)[][] {
		const width = parseInt(layout.BuildingXSize);
		const height = parseInt(layout.BuildingYSize);
		const grid: (number | string)[][] = [];

		for (let y = 0; y < height; y++) {
			const row: (number | string)[] = [];
			for (let x = 0; x < width; x++) {
				row.push(layout.Layout[y * width + x]);
			}
			grid.push(row);
		}
		return grid;
	}


	// Validate and process the JSON file
	onFileSelected(event: Event): void {
		const file = (event.target as HTMLInputElement).files?.[0];
		if (!file) {
			this.showError('No file selected.');
			return;
		}

		const reader = new FileReader();
		reader.onload = (e) => {
			try {
				const content = e.target?.result as string;
				if (!content) {
					throw new Error('File content is empty.');
				}
				const parsed = JSON.parse(content);

				// Validate required fields including BedIDList
				if (!parsed.BuildingXSize || !parsed.BuildingYSize ||
					!parsed.Layout || !Array.isArray(parsed.BedIDList)) {
					throw new Error('The JSON file does not contain the required fields.');
				}

				// Validate building dimensions
				if (isNaN(parseInt(parsed.BuildingXSize)) ||
					isNaN(parseInt(parsed.BuildingYSize))) {
					throw new Error('The building dimensions are invalid.');
				}
				this.BedIDList = parsed.BedIDList; // Load BedIDList

				this.currentLayout = parsed;
				console.log('Layout loaded:', this.currentLayout);
				this.renderLayout();
			} catch (error) {
				console.error('Error parsing JSON:', error);
				this.showError('Error parsing the JSON file.');
				this.currentLayout = null;
			}
		};
		reader.onerror = (error) => {
			console.error('Error reading file:', error);
			this.showError('Error reading the selected file.');
			this.currentLayout = null;
		};

		reader.readAsText(file);
	}

	renderLayout(): void {
		if (!this.currentLayout) return;

		this.clearScene();

		// Add lighting back after clear
		const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
		const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
		directionalLight.position.set(5, 10, 7);
		this.scene.add(ambientLight);
		this.scene.add(directionalLight);

		const grid = this.convertLayoutToGrid(this.currentLayout);
		const width = parseInt(this.currentLayout.BuildingXSize);
		const height = parseInt(this.currentLayout.BuildingYSize);

		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				this.createFloorTile(x, y);
				const tileType = grid[y][x];
				if (tileType !== 0) {
					this.createTile(tileType, x, y);
				}
			}
		}

		// Update camera position based on room size
		const maxDim = Math.max(width, height);
		this.camera.position.set(width / 2, maxDim * 1.5, height * 1.5);
		this.camera.lookAt(width / 2, 0, height / 2);
	}

private onDocumentMouseDown(event: MouseEvent): void {
	event.preventDefault

	this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

	this.raycaster.setFromCamera(this.mouse, this.camera);

	const intersects = this.raycaster.intersectObjects(this.scene.children, true);

	if (intersects.length > 0) {
		const object = intersects[0].object;
		if (object.userData['type'] === 'bed') {
			this.selectBed(object);
		}
	}
}




private selectBed(bed: THREE.Object3D): void {
    this.deselectBed();

    this.selectedBed = bed;
    this.selectedRoomId = bed.userData['RoomId'];

    // Zmiana koloru wybranego łóżka
    this.selectedBed.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            const material = mesh.material as THREE.MeshStandardMaterial;
            this.originalBedColor = material.color.clone();
            material.color.set(0xff0000);
        }
    });

    this.loadRoomInfo(this.selectedRoomId!);

    // Pobranie globalnej pozycji łóżka
    const bedWorldPosition = new THREE.Vector3();
    bed.getWorldPosition(bedWorldPosition);

    // Korekta pozycji w osi Y, aby dopasować do centrum łóżka
    bedWorldPosition.y = 0.1; // Stała wysokość centrum łóżka (poprawione ręcznie)

    console.log('Corrected Bed Position:', bedWorldPosition);

    // Przesunięcie kamery i światła do nowej pozycji
    this.smoothmoveCameraToRoomCenter(bedWorldPosition);
    this.smoothMoveSpotlightTo(bedWorldPosition);
}


private selectBedByProximityIgnoringZ(clickedPosition: THREE.Vector3): void {
    const beds = [
        { id: 'bed1', position: new THREE.Vector3(1, 0.1, 1) },
        { id: 'bed2', position: new THREE.Vector3(8, 0.1, 1) },
        { id: 'bed3', position: new THREE.Vector3(1, 0.1, 8) },
        { id: 'bed4', position: new THREE.Vector3(8, 0.1, 8) },
    ];

    const proximityThreshold = 1.0; // Promień w jednostkach 3D
    let closestBed: { id: string; position: THREE.Vector3 } | null = null;
    let closestDistance = Infinity;

    // Przeszukiwanie wszystkich łóżek, aby znaleźć najbliższe w zasięgu (ignorując 'z')
    for (const bed of beds) {
        const distance = this.calculate2DDistance(clickedPosition, bed.position);
        if (distance < proximityThreshold && distance < closestDistance) {
            closestBed = bed;
            closestDistance = distance;
        }
    }

    if (closestBed) {
        console.log(`Bed ${closestBed.id} selected with position:`, closestBed.position);
        this.selectBedById(closestBed.id, closestBed.position);
    } else {
        console.log('No bed selected. Click was outside the proximity range.');
    }
}

// Funkcja obliczająca odległość w płaszczyźnie 'x-y'
private calculate2DDistance(pos1: THREE.Vector3, pos2: THREE.Vector3): number {
    const dx = pos1.x - pos2.x;
    const dz = pos1.z - pos2.z; // Możesz pominąć dy, jeśli to nieistotne
    return Math.sqrt(dx * dx + dz * dz); // Zwraca odległość ignorując 'z'
}

private selectBedById(bedId: string, bedPosition: THREE.Vector3): void {
    this.deselectBed();

    this.selectedRoomId = bedId;

    // Logowanie wybranych danych
    console.log(`Selected bed: ${bedId} at position:`, bedPosition);

    // Zmiana koloru lub wizualizacja, jeśli konieczne
    // Można tutaj dodać dodatkowe operacje wizualne, jeśli łóżko jest obiektem 3D

    // Przesunięcie kamery i światła
    this.smoothmoveCameraToRoomCenter(bedPosition);
    this.smoothMoveSpotlightTo(bedPosition);
}


	
private moveCameraToRoomCenter(targetPosition: THREE.Vector3): void {
	const currentCameraPosition = this.camera.position.clone();
	const newCameraPosition = new THREE.Vector3(targetPosition.x, currentCameraPosition.y, targetPosition.z);
	this.camera.position.copy(newCameraPosition);
	this.camera.lookAt(targetPosition);
}

private smoothmoveCameraToRoomCenter(targetPosition: THREE.Vector3): void {
	const currentCameraPosition = this.camera.position.clone();
	const newCameraPosition = new THREE.Vector3(targetPosition.x, 9, targetPosition.z);
	const tween = new TWEEN.Tween(currentCameraPosition)
		.to(newCameraPosition, 1000)
		.easing(TWEEN.Easing.Quadratic.Out)
		.onUpdate(() => {
			this.camera.position.copy(currentCameraPosition);
			this.camera.lookAt(targetPosition);
		})
		.start();
}

private smoothMoveSpotlightTo(targetPosition: THREE.Vector3): void {
    // Ensure spotlight exists, or create it if necessary
    if (!this.spotlight) {
        console.log("Spotlight not found, creating a new one...");
        this.spotlight = new THREE.SpotLight(0x00ff00, 1);
        this.spotlight.castShadow = true;
        this.spotlight.shadow.mapSize.width = 1024;
        this.spotlight.shadow.mapSize.height = 1024;
        this.spotlight.shadow.camera.near = 0.5;
        this.spotlight.shadow.camera.far = 500;

        // Add spotlight to the scene
        this.scene.add(this.spotlight);

        // Add target for the spotlight
        this.spotlight.target = new THREE.Object3D();
        this.scene.add(this.spotlight.target);
    }

    // Get the current spotlight position and set the new target position
    const currentSpotlightPosition = this.spotlight.position.clone();
    const newSpotlightPosition = this.camera.position.clone(); // Match the camera's position
    newSpotlightPosition.y += 2; // Optional: Offset the spotlight slightly above the camera
    const spotlightTargetPosition = new THREE.Vector3(targetPosition.x, targetPosition.y, targetPosition.z);

    // Animate the spotlight position to match the camera's movement
    new TWEEN.Tween(currentSpotlightPosition)
        .to(newSpotlightPosition, 1000) // 1000 ms for the animation duration
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(() => {
            this.spotlight.position.copy(currentSpotlightPosition);
            this.spotlight.target.position.copy(spotlightTargetPosition);
            this.spotlight.target.updateMatrixWorld();
        })
        .start();
}





private deselectBed(): void {
    if (this.selectedBed && this.originalBedColor) {
        this.selectedBed.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;
                const material = mesh.material as THREE.MeshStandardMaterial;
                material.color.copy(this.originalBedColor!);
            }
        });
        this.selectedBed = null;
        this.selectedRoomId = null;
        this.originalBedColor = null;
        this.hideRoomInfo();
    }
}



	async loadRoomInfo(RoomId: string): Promise<void> {
		try {
			const response = await fetch(`assets/Render3D/Resources/RoomInformation/${RoomId}.json`);
			if (!response.ok) {
				throw new Error('Room info not found for the given room ID: ' + RoomId);
			}
			this.roomInfo = await response.json();
			this.showInfoPanel = true;
		} catch (error) {
			console.error('Error loading room info:', error);
			this.showError('Failed to load room information: ' + RoomId);
		}
	}

	hideRoomInfo(): void {

		this.roomInfo = null;
		this.showInfoPanel = false;
	}

	@HostListener('window:keydown', ['$event'])
	handleKeyboardEvent(event: KeyboardEvent) {
	  if (event.key.toLowerCase() === 'i') {
		if (this.showInfoPanel) {
			this.showInfoPanel = false;
		  this.hideRoomInfo();
		} else if (this.selectedRoomId) {
		  this.loadRoomInfo(this.selectedRoomId);
		  this.showInfoPanel = true;

		} 
	  }
	}

  private spotlight!: THREE.SpotLight;
  private spotlightTarget!: THREE.Object3D;

  private addSpotlight(): void {
    // Create a spotlight
    this.spotlight = new THREE.SpotLight(0xffffff, 1);
    this.spotlight.angle = Math.PI / 6; // Adjust the angle
    this.spotlight.penumbra = 0.3; // Soft edges for the spotlight
    this.spotlight.castShadow = true;
    this.spotlight.shadow.mapSize.width = 1024;
    this.spotlight.shadow.mapSize.height = 1024;
    this.spotlight.shadow.camera.near = 0.5;
    this.spotlight.shadow.camera.far = 500;

    // Add spotlight to the scene
    this.scene.add(this.spotlight);

    // Create a target object
    this.spotlightTarget = new THREE.Object3D();
    this.scene.add(this.spotlightTarget);

    // Set the spotlight to target the object
    this.spotlight.target = this.spotlightTarget;
}

private updateSpotlight(): void {
    if (this.spotlight && this.spotlightTarget) {
        // Position the spotlight at the camera's position
        this.spotlight.position.copy(this.camera.position);

        // Update spotlight direction to always point to the target
        this.spotlight.target.updateMatrixWorld();
    }
}

  private setSpotlightTarget(position: THREE.Vector3): void {
    // Move the spotlight target to the surgical table center point
    this.spotlightTarget.position.copy(position);

    // Ensure the spotlight target updates
    this.spotlight.target.updateMatrixWorld();
  }


}


