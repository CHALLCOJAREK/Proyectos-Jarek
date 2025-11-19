 window.addEventListener('load', () => {
            const loader = document.getElementById('loader');
            const progressBar = document.getElementById('progress-bar');
            const percentageText = document.getElementById('progress-percentage');
            
            const imageUrls = [
                'https://drive.google.com/thumbnail?id=1uv9wOVYu8h8PbX4EDBPl4YUm0ZMYNOj1',
                'https://drive.google.com/thumbnail?id=1MD6SmwkJ_5hhSCON1E9oUV6CJqL2BTKb',
                'https://drive.google.com/thumbnail?id=1SsZk-dSh2jGsS2kGgCqhZIgeD9ZUi_jM'
            ];

            let imagesLoaded = 0;
            const totalImages = imageUrls.length;

            if (totalImages === 0) {
                startApp(); return;
            }

            const imageLoaded = () => {
                imagesLoaded++;
                let percent = Math.round((imagesLoaded / totalImages) * 100);
                progressBar.style.width = percent + '%';
                percentageText.textContent = percent + '%';
                if (imagesLoaded === totalImages) setTimeout(startApp, 500);
            };

            imageUrls.forEach(url => {
                const img = new Image();
                img.onload = imageLoaded;
                img.onerror = imageLoaded;
                img.src = url;
            });

            function startApp() {
                loader.classList.add('hidden');
                loader.addEventListener('transitionend', initializeLetter, { once: true });
            }
        });

        function initializeLetter() {
            const envoltura = document.querySelector(".envoltura-sobre");
            const carta = document.querySelector(".carta");
            const sonido = document.getElementById("sound");
            
            let isAnimating = false;
            let cartaAbierta = false;
            const esMovil = window.innerWidth <= 768;

            function gestionarAnimacion(accion) {
                if (isAnimating) return;
                isAnimating = true;

                if (accion === 'abrir') {
                    envoltura.classList.add('abierto');
                    sonido.play().catch(e => console.log("La reproducción automática fue bloqueada."));
                    
                    if (esMovil) {
                        setTimeout(() => {
                            carta.style.top = '15px';
                            carta.style.transform = 'translateX(-50%)';
                            carta.style.width = '95vw';
                            carta.style.height = 'calc(100vh - 30px)';
                        }, 1700);
                    }

                    carta.addEventListener('animationend', () => {
                        isAnimating = false;
                        cartaAbierta = true;
                    }, { once: true });
                    setTimeout(crearCorazones, 800);

                } else if (accion === 'cerrar') {
                    carta.style.top = '';
                    carta.style.transform = '';
                    carta.style.width = '';
                    carta.style.height = '';
                    void carta.offsetWidth;
                    
                    envoltura.classList.add('cerrando');
                    if(sonido) {
                      sonido.pause();
                      sonido.currentTime = 0;
                    }

                    carta.addEventListener('animationend', () => {
                        envoltura.classList.remove('abierto', 'cerrando');
                        isAnimating = false;
                        cartaAbierta = false;
                    }, { once: true });
                }
            }
            
            document.addEventListener('click', (e) => {
                if (isAnimating) return;
                const clickEnSobre = e.target.closest('.envoltura-sobre');
                const clickEnCarta = e.target.closest('.carta');
                
                if (!cartaAbierta) {
                    if (clickEnSobre && !clickEnSobre.classList.contains('abierto')) {
                        gestionarAnimacion('abrir');
                    }
                } else {
                    /* --- LÓGICA DE CIERRE RESTAURADA (MODIFICADO) --- */
                    // Permite cerrar la carta tocando DENTRO en móviles, o FUERA en cualquier dispositivo.
                    if ((esMovil && clickEnCarta) || !clickEnCarta) {
                        gestionarAnimacion('cerrar');
                    }
                }
            });

            function crearCorazones() {
                if (!envoltura.classList.contains('abierto') || envoltura.classList.contains('cerrando')) return;
                
                const contenedor = document.body;
                const cantidad = 30;
                const emojis = ['❤️', '💖', '💕', '✨', '💜', '💙', '💚'];
                const sobreRect = envoltura.getBoundingClientRect();
                const startX = sobreRect.left + sobreRect.width / 2;
                const startY = sobreRect.top + sobreRect.height / 2;

                for (let i = 0; i < cantidad; i++) {
                    setTimeout(() => {
                        if (!cartaAbierta) return;
                        const corazon = document.createElement('div');
                        corazon.className = 'corazon-magico';
                        corazon.innerHTML = emojis[i % emojis.length];
                        
                        corazon.style.left = `${startX}px`;
                        corazon.style.top = `${startY}px`;

                        const duracion = Math.random() * 2 + 3;
                        const fontSize = Math.random() * 15 + 15;
                        const xEnd = (Math.random() - 0.5) * window.innerWidth * 1.2;
                        const yEnd = (Math.random() - 0.5) * window.innerHeight * 1.2;
                        const scaleEnd = Math.random() * 0.5 + 0.25;
                        const rotationEnd = (Math.random() - 0.5) * 720;
                        const xMid = (Math.random() - 0.5) * 200;
                        const yMid = (Math.random() - 0.5) * 200;
                        const rotationMid = (Math.random() - 0.5) * 360;
                        
                        corazon.style.setProperty('--dur', `${duracion}s`);
                        corazon.style.setProperty('--fs', `${fontSize}px`);
                        corazon.style.setProperty('--x-end', `${xEnd}px`);
                        corazon.style.setProperty('--y-end', `${yEnd}px`);
                        corazon.style.setProperty('--s-end', scaleEnd);
                        corazon.style.setProperty('--r-end', `${rotationEnd}deg`);
                        corazon.style.setProperty('--x-mid', `${xMid}px`);
                        corazon.style.setProperty('--y-mid', `${yMid}px`);
                        corazon.style.setProperty('--r-mid', `${rotationMid}deg`);
                        
                        contenedor.appendChild(corazon);
                        setTimeout(() => corazon.remove(), duracion * 1000);

                    }, i * 50);
                }
            }
        }