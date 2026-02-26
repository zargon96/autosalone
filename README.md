# 3D Car Showcase

Un'applicazione React + Three.js per esplorare modelli 3D di auto sportive e classiche in tempo reale, con schede tecniche interattive e un'esperienza immersiva a 360°.

---

## Funzionalità

- **Visualizzazione 3D**: modelli GLB compressi con Draco, caricati e ottimizzati tramite un canvas globale condiviso tra tutte le pagine
- **Showcase interattivo**: navigazione tra le auto con transizioni animate (GSAP), controlli touch, tastiera e scroll
- **Schede tecniche**: dati dettagliati su motore, prestazioni e dimensioni con animazioni fluide
- **Experience mode**: esplora i dettagli del modello 3D tramite hotspot interattivi proiettati in spazio 3D, con zoom automatico della telecamera sui punti di interesse
- **Navigazione tra modelli**: frecce per passare da un'auto all'altra direttamente dall'experience
- **Supporto multilingua**: italiano e inglese con traduzioni dinamiche
- **Conversione automatica**: unità di misura (CV↔HP, kg↔lb, mm↔in) e valuta (EUR↔GBP) in base alla lingua selezionata
- **Responsive**: layout e hotspot adattivi per desktop, laptop e mobile — su mobile gli hotspot 3D vengono sostituiti da bottoni flat
- **Preloader**: barra di avanzamento animata sincronizzata con il caricamento dei modelli 3D

---

## Architettura

- **GlobalCanvas**: canvas Three.js unico montato a livello di app, condiviso tra Home, Hero e CarExperience per evitare re-mount costosi
- **CanvasContext + CanvasLiveContext**: due context separati — uno per lo stato stabile (mode, activeCarId, steps) e uno per i dati ad alta frequenza (camera, rotation, hotspot positions) per minimizzare i re-render
- **HotspotTracker**: componente Three.js puro che proietta le coordinate 3D in percentuali schermo, aggiorna lo stato solo quando le posizioni cambiano realmente
- **HotspotOverlayHTML**: overlay HTML montato fuori dal Canvas tramite `ReactDOM.createPortal` per evitare errori di namespace R3F

---

## Stack Tecnologico

- [React 18](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Three.js](https://threejs.org/)
- [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber)
- [@react-three/drei](https://github.com/pmndrs/drei)
- [GSAP](https://gsap.com/)
- [Bootstrap](https://getbootstrap.com/)
- [Draco](https://google.github.io/draco/) per la compressione dei modelli GLB
- API [Frankfurter.app](https://www.frankfurter.app/) per i tassi di cambio in tempo reale

---

## Performance

- Modelli compressi con Draco (~60-80% di riduzione)
- Warmup del canvas alla prima renderizzazione per evitare lag al primo frame
- `matrixAutoUpdate` disabilitato sui mesh statici
- Nessun import lazy sulle pagine principali (Home, Hero, CarExperience) per evitare ritardi di navigazione
- Canvas WebGL condiviso con shader GLSL custom per effetti luce volumetrica, con interpolazione lerp per transizioni colore fluide tra le sezioni
