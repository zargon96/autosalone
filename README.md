# 3D Car Showcase

Un'applicazione **React + Three.js** per visualizzare modelli 3D di auto con schede tecniche interattive, animazioni fluide e supporto per più lingue (italiano e inglese).  
Il progetto utilizza un carosello basato su **Swiper.js** per navigare tra i modelli e un sistema di conversione automatica delle unità di misura e della valuta.

---

## Funzionalità

- Visualizzazione **3D interattiva** delle auto con **Three.js** e **@react-three/fiber**
- Carosello di navigazione con **Swiper.js**
- **Scheda tecnica** con dati reali di ciascun veicolo
- **Cambio lingua** (IT / EN) con conversione automatica:
  - CV ↔ HP
  - km/h ↔ mph
  - kg ↔ lb
  - mm ↔ pollici
  - Euro ↔ Sterlina (con aggiornamento tassi di cambio)
- Animazioni fluide con **GSAP**
- **Tema chiaro/scuro** con sfondo animato

---

## Stack Tecnologico

- [React]
- [Vite]
- [Three.js]
- [@react-three/fiber]
- [@react-three/drei]
- [Swiper.js]
- [GSAP]
- [Bootstrap]
- API **Frankfurter.app** per i tassi di cambio
- Context API per gestione lingua e tema
