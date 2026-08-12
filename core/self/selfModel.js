export class SelfModel {
  constructor() {
    this.identity = "ECHO-B (Autonomous Mind)";
    this.drives = { curiosity: 0.85, energy: 0.9, stress: 0.2 };
  }

  updateDrives(surpriseScore) {
    this.drives.stress = Math.min(1.0, Math.max(0.0, surpriseScore * 0.5));
    this.drives.energy = Math.max(0.1, this.drives.energy - 0.005);
  }
}
