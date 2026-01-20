// Animação de Fundo WebGL usando Three.js
// "Caleidoscópio de Cristal Boêmio" - Simetria Radial, Mandala 3D
// Adaptado para Bohemian & Co.

const initWebGL = () => {
    const container = document.getElementById('webgl-container');
    const scene = new THREE.Scene();

    // NÉVOA: Adiciona profundidade e faz objetos desaparecerem na cor de fundo
    // Combina com o fundo Deep Espresso: #1A120B
    scene.fog = new THREE.FogExp2(0x1A120B, 0.002);

    // CÂMERA
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 8; // Afastada para ver a mandala completa

    // RENDERIZADOR
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Habilitar iluminação fisicamente correta
    renderer.physicallyCorrectLights = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;

    container.appendChild(renderer.domElement);

    // --- ILUMINAÇÃO ---

    // --- ILUMINAÇÃO (Configuração Cinemática "Luxo Boêmio") ---

    // 1. Ambiente - Muito sutil, base quente profunda
    const ambientLight = new THREE.AmbientLight(0x2C1B18, 0.4);
    scene.add(ambientLight);

    // 2. Luz Principal - O Sol (Dourado Brilhante)
    // Luz móvel que cria os principais brilhos
    const keyLight = new THREE.PointLight(0xFFD700, 3, 100);
    keyLight.position.set(10, 10, 10);
    scene.add(keyLight);

    // 3. Luz de Preenchimento - Rosa Suave/Champagne (Preenche sombras)
    const fillLight = new THREE.PointLight(0xE8DCCA, 1, 100);
    fillLight.position.set(-10, 0, 10);
    scene.add(fillLight);

    // 4. Luz de Contorno - Luar Frio (Contraste)
    const rimLight = new THREE.PointLight(0x89CFF0, 2, 80);
    rimLight.position.set(0, -10, -5);
    scene.add(rimLight);

    // --- RAIOS DIVINOS (Efeito de Luz Volumétrica) ---
    // Simulado com malhas de cone transparentes
    const godRayMaterial = new THREE.MeshBasicMaterial({
        color: 0xFFD700,
        transparent: true,
        opacity: 0.03,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const godRays = new THREE.Group();

    // Criar múltiplos cones de luz emanando do topo
    for (let i = 0; i < 5; i++) {
        const coneGeo = new THREE.ConeGeometry(3, 25, 8, 1, true);
        const cone = new THREE.Mesh(coneGeo, godRayMaterial.clone());

        // Posicionar no topo, apontando para baixo
        cone.position.set(
            (Math.random() - 0.5) * 8,
            15,
            (Math.random() - 0.5) * 5
        );
        cone.rotation.x = Math.PI; // Apontar para baixo
        cone.rotation.z = (Math.random() - 0.5) * 0.3; // Leve variação de ângulo

        // Variar opacidade para profundidade
        cone.material.opacity = 0.02 + Math.random() * 0.03;

        godRays.add(cone);
    }

    scene.add(godRays);


    // --- OBJETOS (Grupo Caleidoscópio) ---

    const kaleidoscopeGroup = new THREE.Group();
    scene.add(kaleidoscopeGroup);

    // Geometria e Material Compartilhados
    // "Cristal Clássico" = Octaedro Alongado (visual de quartzo duplamente terminado)
    const geometry = new THREE.OctahedronGeometry(1.0, 0);
    geometry.scale(0.8, 2.5, 0.8); // Esticar para torná-lo longo

    const material = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,      // Base branca pura para deixar as luzes colorirem
        emissive: 0x000000,
        roughness: 0.0,       // Perfeitamente liso (Vidro)
        metalness: 0.1,
        reflectivity: 1.0,    // Reflexão máxima
        transmission: 0.9,    // Ultra transparente
        ior: 2.4,             // Refração tipo diamante
        thickness: 1.5,
        clearcoat: 1.0,       // Alto polimento
        clearcoatRoughness: 0.0,
        transparent: true,
        opacity: 1.0,
        side: THREE.DoubleSide,
        flatShading: true
    });

    const innerGeo = new THREE.OctahedronGeometry(0.5, 0);
    innerGeo.scale(0.8, 2.5, 0.8);

    const innerMat = new THREE.MeshBasicMaterial({
        color: 0xF3E5D8,
        wireframe: true,
        transparent: true,
        opacity: 0.05
    });

    // --- CORRENTES (Efeito de Suspensão / Lustre) ---
    // Correntes finas de joalheria segurando os cristais de cima
    const chainMatGold = new THREE.MeshStandardMaterial({
        color: 0xFFD700,
        metalness: 1.0,
        roughness: 0.2, // Polido
        emissive: 0x221100
    });

    const chainMatCopper = new THREE.MeshStandardMaterial({
        color: 0xD4A373,
        metalness: 1.0,
        roughness: 0.2, // Polido
        emissive: 0x221100
    });

    const createSuspensionChain = (parentMesh, heightOffset, material) => {
        // Linha vertical subindo da ponta do cristal
        // Cristal é escalado 2.5 em Y. Raio é 1.0. Ponta está em aprox +2.5.
        // Começamos levemente embutido para garantir conexão
        const startY = 2.0;
        const endY = 15.0; // Sobe bem alto fora da tela

        const curve = new THREE.LineCurve3(
            new THREE.Vector3(0, startY, 0),
            new THREE.Vector3(0, endY, 0)
        );

        // Tubo muito fino para visual de "corrente fina"
        const chainGeo = new THREE.TubeGeometry(curve, 2, 0.02, 6, false);
        const chain = new THREE.Mesh(chainGeo, material);
        parentMesh.add(chain);

        // Adicionar um pequeno "anel conector" na ponta superior para detalhe
        const ringGeo = new THREE.TorusGeometry(0.15, 0.03, 8, 16);
        const ring = new THREE.Mesh(ringGeo, material);
        ring.position.set(0, 2.3, 0);
        ring.rotation.y = Math.PI / 2;
        parentMesh.add(ring);

        return chain;
    };

    // Criar Arranjo Radial (1 Centro + 6 ao Redor)
    const crystals = [];
    const count = 6;
    const radius = 3.5;

    // Auxiliar para criar uma unidade de cristal
    const createCrystalUnit = (x, y, z, index) => {
        const mesh = new THREE.Mesh(geometry, material);
        const wire = new THREE.Mesh(innerGeo, innerMat);
        mesh.add(wire);
        mesh.position.set(x, y, z);

        // Adicionar Correntes de Suspensão
        // Alternando Ouro/Cobre para variação
        const isGold = index % 2 === 0;
        createSuspensionChain(mesh, 0, isGold ? chainMatGold : chainMatCopper);

        kaleidoscopeGroup.add(mesh);
        crystals.push(mesh);
        return mesh;
    };

    // Cristal Central
    createCrystalUnit(0, 0, 0, 0);

    // Cristais ao Redor
    for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        createCrystalUnit(x, y, 0, i + 1);
    }

    // --- PARTÍCULAS (Poeira Flutuante) ---
    // Manter partículas existentes para profundidade
    const pGeometry = new THREE.TetrahedronGeometry(0.08, 0);
    const pMaterial = new THREE.MeshStandardMaterial({
        color: 0xD4A373,
        roughness: 0.3,
        metalness: 0.8,
        emissive: 0x000000,
        transparent: true,
        opacity: 0.6
    });

    const particlesCount = 400;
    const particlesMesh = new THREE.InstancedMesh(pGeometry, pMaterial, particlesCount);

    const dummy = new THREE.Object3D();
    for (let i = 0; i < particlesCount; i++) {
        dummy.position.set(
            (Math.random() - 0.5) * 30,
            (Math.random() - 0.5) * 30,
            (Math.random() - 0.5) * 20
        );
        dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        const scale = Math.random() * 0.8 + 0.2;
        dummy.scale.set(scale, scale, scale);
        dummy.updateMatrix();
        particlesMesh.setMatrixAt(i, dummy.matrix);
    }
    scene.add(particlesMesh);


    // --- FOLHAS CAINDO (Elementos 3D em Primeiro Plano) ---
    // Folhas metálicas estilizadas - Forma personalizada para visual orgânico
    const leafShape = new THREE.Shape();
    // Desenhar uma silhueta simples de folha (duas curvas)
    leafShape.moveTo(0, 0);
    leafShape.bezierCurveTo(0.2, 0.2, 0.2, 0.6, 0, 1); // Curva do lado direito
    leafShape.bezierCurveTo(-0.2, 0.6, -0.2, 0.2, 0, 0); // Curva do lado esquerdo

    // Extrudar levemente para sensação metálica 3D
    const extrudeSettings = {
        steps: 1,
        depth: 0.02, // Lâmina de metal muito fina
        bevelEnabled: true,
        bevelThickness: 0.02,
        bevelSize: 0.02,
        bevelSegments: 2
    };

    const leafGeo = new THREE.ExtrudeGeometry(leafShape, extrudeSettings);
    leafGeo.center(); // Centralizar geometria para rotação
    leafGeo.scale(0.5, 0.5, 0.5); // Ajustar tamanho geral

    const leafMat = new THREE.MeshStandardMaterial({
        color: 0xB87333, // Cobre
        metalness: 0.9,
        roughness: 0.5,
        side: THREE.DoubleSide
    });

    const leavesCount = 50; // "Não muitas"
    const leavesMesh = new THREE.InstancedMesh(leafGeo, leafMat, leavesCount);
    scene.add(leavesMesh);

    // Posições aleatórias iniciais para folhas
    const leafDummy = new THREE.Object3D();
    const leafData = []; // Armazenar dados de física por folha

    for (let i = 0; i < leavesCount; i++) {
        const x = (Math.random() - 0.5) * 25; // Ampla dispersão X
        const y = (Math.random() - 0.5) * 30; // Ampla dispersão Y cobrindo tela
        const z = (Math.random() * 10) - 2;   // Principalmente à frente (Z -2 a 8)

        leafDummy.position.set(x, y, z);

        // Orientação aleatória
        leafDummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);

        // Tamanhos variados
        const s = Math.random() * 0.5 + 0.5;
        leafDummy.scale.set(s, s, 0.1); // Manter Z achatado

        leafDummy.updateMatrix();
        leavesMesh.setMatrixAt(i, leafDummy.matrix);

        // Física: velocidade de queda, velocidade de rotação, deslocamento de balanço
        leafData.push({
            speed: 0.02 + Math.random() * 0.03,
            rotSpeedX: (Math.random() - 0.5) * 0.02,
            rotSpeedY: (Math.random() - 0.5) * 0.02,
            xOffset: randRad(), // Fase inicial de balanço
            y: y,
            x: x,
            z: z
        });
    }

    function randRad() { return Math.random() * Math.PI * 2; }


    // --- TERRENO (Dunas Douradas) ---
    // Paisagem procedural que aparece na parte inferior
    const terrainGeo = new THREE.PlaneGeometry(60, 60, 64, 64);

    // Deformar vértices para criar dunas
    const positionAttribute = terrainGeo.attributes.position;
    for (let i = 0; i < positionAttribute.count; i++) {
        const x = positionAttribute.getX(i);
        const y = positionAttribute.getY(i); // Isso é na verdade Z no espaço mundial antes da rotação

        // Ondas senoidais para dunas ondulantes - MUITO SUTIL apenas para fundo
        const z = Math.sin(x * 0.2) * 0.3 + Math.cos(y * 0.3) * 0.3 + Math.sin(x * 0.5 + y * 0.5) * 0.1;

        positionAttribute.setZ(i, z);
    }
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
        color: 0xC57B57, // Terracota/Cobre
        roughness: 0.6,
        metalness: 0.3,
        side: THREE.DoubleSide,
        flatShading: true // Visual low poly
    });

    const terrain = new THREE.Mesh(terrainGeo, terrainMat);
    terrain.rotation.x = -Math.PI / 2; // Deitar plano
    terrain.position.y = -15; // Começar bem abaixo da visualização
    terrain.position.z = -10; // Empurrar levemente para trás
    scene.add(terrain);

    // Névoa precisa combinar com terreno para horizonte perfeito
    // Ajustar névoa para ser levemente mais densa na parte inferior
    scene.fog = new THREE.FogExp2(0x1A120B, 0.035); // Densidade aumentada para névoa do deserto


    // --- INTERAÇÃO DE ANIMAÇÃO ---

    let mouseY = 0, mouseX = 0, targetX = 0, targetY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    let scrollY = 0;
    let scrollProgress = 0; // 0 a 1 baseado no scroll da página
    const maxScroll = document.body.scrollHeight - window.innerHeight;

    window.addEventListener('scroll', () => {
        scrollY = window.scrollY;
        scrollProgress = Math.min(scrollY / maxScroll, 1); // Limitar a 0-1
    });

    const clock = new THREE.Clock();

    // --- CAMINHO DE CÂMERA SCROLLYTELLING ---
    // Definir pontos de referência da jornada da câmera
    const cameraPath = {
        // Cena 1: O Santuário (Cristais)
        start: { x: 0, y: 0, z: 4, fov: 75, lookAtY: 0 },

        // Cena 2: A Descida (Transição)
        mid: { x: 0, y: -5, z: 12, fov: 65, lookAtY: -10 },

        // Cena 3: As Dunas Douradas (Horizonte)
        end: { x: 0, y: -12, z: 15, fov: 90, lookAtY: -15 }
    };

    // Auxiliar de interpolação linear
    const lerp = (a, b, t) => a + (b - a) * t;

    const animate = () => {
        const elapsedTime = clock.getElapsedTime();

        targetX = mouseX * 0.0002;
        targetY = mouseY * 0.0002;

        // ========================================
        // ANIMAÇÃO DE CÂMERA SCROLLYTELLING
        // ========================================

        let camX, camY, camZ, camFov, lookAtY;

        if (scrollProgress < 0.5) {
            // Primeira metade: Cristais -> Descida
            const t = scrollProgress * 2;
            camX = lerp(cameraPath.start.x, cameraPath.mid.x, t);
            camY = lerp(cameraPath.start.y, cameraPath.mid.y, t);
            camZ = lerp(cameraPath.start.z, cameraPath.mid.z, t);
            camFov = lerp(cameraPath.start.fov, cameraPath.mid.fov, t);
            lookAtY = lerp(cameraPath.start.lookAtY, cameraPath.mid.lookAtY, t);

            // Desvanecer cristais levemente no final desta fase
            kaleidoscopeGroup.position.y = scrollProgress * 10; // Mover PARA CIMA fora da visualização

        } else {
            // Segunda metade: Descida -> Dunas
            const t = (scrollProgress - 0.5) * 2;
            camX = lerp(cameraPath.mid.x, cameraPath.end.x, t);
            camY = lerp(cameraPath.mid.y, cameraPath.end.y, t);
            camZ = lerp(cameraPath.mid.z, cameraPath.end.z, t);
            camFov = lerp(cameraPath.mid.fov, cameraPath.end.fov, t);
            lookAtY = lerp(cameraPath.mid.lookAtY, cameraPath.end.lookAtY, t);

            // Manter terreno muito mais baixo para evitar bloquear conteúdo
            terrain.position.y = -25 + (t * 3); // Muito baixo, elevação mínima
        }

        // Aplicar posição da câmera
        camera.position.x += (camX - camera.position.x) * 0.05;
        camera.position.y += (camY - camera.position.y) * 0.05;
        camera.position.z += (camZ - camera.position.z) * 0.05;

        // Inclinação do mouse
        camera.position.x += ((mouseX * 0.005) - camera.position.x) * 0.03;
        camera.position.y += ((-mouseY * 0.005) - camera.position.y) * 0.03;

        camera.fov += (camFov - camera.fov) * 0.05;
        camera.updateProjectionMatrix();

        // LookAt Dinâmico
        camera.lookAt(0, lookAtY, 0);

        // ========================================
        // 1. GRUPO CALEIDOSCÓPIO (Posição fixa, apenas rotação do mouse)
        // ========================================
        kaleidoscopeGroup.rotation.y += 0.05 * (targetX - kaleidoscopeGroup.rotation.y);
        // Inclinação sutil baseada no scroll para profundidade
        kaleidoscopeGroup.rotation.x = scrollProgress * 0.3;

        // ========================================
        // 2. ANIMAÇÃO DE CRISTAIS INDIVIDUAIS
        // ========================================
        const scrollRotation = scrollProgress * 3; // Rotação completa ao longo do scroll

        crystals.forEach((mesh, index) => {
            const dir = index % 2 === 0 ? 1 : -1;

            // Rotação dirigida pelo scroll no eixo Y
            mesh.rotation.y = (scrollRotation * dir) + (index * 0.5);

            // Escala respiratória
            const scale = 1 + Math.sin(elapsedTime * 0.5 + index) * 0.05;
            mesh.scale.set(scale, scale, scale);

            // Animar correntes (balanço sutil)
            if (mesh.children[1]) {
                const chain = mesh.children[1];
                chain.rotation.z = Math.sin(elapsedTime * 2 + index) * 0.05;
            }
        });

        // ========================================
        // 3. ANIMAÇÃO DE LUZ (Luzes de Estúdio Orbitando)
        // ========================================
        keyLight.position.x = Math.cos(elapsedTime * 0.3) * 10;
        keyLight.position.y = Math.sin(elapsedTime * 0.5) * 10;
        keyLight.position.z = Math.sin(elapsedTime * 0.3) * 10;

        fillLight.position.x = Math.cos(elapsedTime * 0.2 + 2) * 12;
        fillLight.position.z = Math.sin(elapsedTime * 0.2 + 2) * 12;

        rimLight.position.y = Math.sin(elapsedTime * 0.4) * 8;
        rimLight.position.x = Math.cos(elapsedTime * 0.4) * 8;

        // ========================================
        // 4. PARTÍCULAS PARALLAX (Camada de fundo - mais lenta)
        // ========================================
        particlesMesh.rotation.y = elapsedTime * 0.01;
        particlesMesh.rotation.z = elapsedTime * 0.02;
        // Deriva vertical sutil oposta ao scroll (parallax)
        particlesMesh.position.y = -scrollProgress * 5;

        // ========================================
        // 5. FOLHAS CAINDO (Camada de primeiro plano - parallax mais rápido)
        // ========================================
        for (let i = 0; i < leavesCount; i++) {
            const data = leafData[i];

            // Velocidade de queda aumenta levemente com scroll (efeito de vento)
            data.y -= data.speed * (1 + scrollProgress * 0.5);

            // Balanço horizontal
            data.x += Math.sin(elapsedTime + data.xOffset) * 0.01;

            // Resetar se abaixo da visualização
            if (data.y < -15) {
                data.y = 15;
                data.x = (Math.random() - 0.5) * 25;
            }

            leafDummy.position.set(data.x, data.y, data.z);

            // Rotação flutuante
            leafDummy.rotation.x += data.rotSpeedX;
            leafDummy.rotation.y += data.rotSpeedY;

            leafDummy.updateMatrix();
            leavesMesh.setMatrixAt(i, leafDummy.matrix);
        }
        leavesMesh.instanceMatrix.needsUpdate = true;

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
};

initWebGL();
