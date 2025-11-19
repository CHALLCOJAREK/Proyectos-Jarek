function openSection(id){
  document.getElementById("home").style.display = "none";
  document.querySelectorAll(".section").forEach(s => s.style.display = "none");
  document.getElementById(id).style.display = "block";

  if(id === "diario"){
    const frases = [
      "Hoy tu única tarea es ser un poco más amable contigo misma que ayer.",
      "No tienes que poder con todo, solo con lo que hoy te alcance.",
      "Aunque el día sea ruidoso, siempre puedes crear un minuto de silencio para ti.",
      "Estar cansada no te hace menos fuerte. Te hace humana."
    ];
    document.getElementById("diarioText").textContent =
      frases[Math.floor(Math.random()*frases.length)];
  }

  if(id === "aleatorio"){
    const frases = [
      "Hoy el azar dice: que te tomes al menos un momento para ti.",
      "Si nadie te lo dijo hoy: hiciste lo mejor que pudiste con lo que tenías.",
      "No necesitas tener todo claro para estar avanzando.",
      "A veces, descansar también es una forma de seguir."
    ];
    document.getElementById("aleatorioText").textContent =
      frases[Math.floor(Math.random()*frases.length)];
  }

  if(id === "estrellas"){
    const box = document.getElementById("starsBox");
    if(!box.dataset.created){
      for(let i=0;i<40;i++){
        const s = document.createElement("div");
        s.className = "star";
        s.style.left = Math.random()*100 + "%";
        s.style.top = Math.random()*100 + "%";
        s.style.animationDelay = (Math.random()*4)+"s";
        box.appendChild(s);
      }
      box.dataset.created = "1";
    }
  }
}

function goHome(){
  document.querySelectorAll(".section").forEach(s => s.style.display = "none");
  document.getElementById("home").style.display = "block";
}

function setCheckin(level){
  const el = document.getElementById("checkResponse");
  if(level === 1){
    el.textContent = "Aunque el día te canse, sigues valiendo lo mismo que en tus mejores días.";
  } else if(level === 2){
    el.textContent = "Si te sientes cargada, está bien soltar un poco. No tienes que sostenerlo todo sola.";
  } else {
    el.textContent = "Si alguna vez quieres hablar, aquí hay alguien dispuesto a escucharte, sin prisa.";
  }
}



// ---------------------------------------------------------------------
// ⭐⭐ GALERÍA – AQUÍ PEGAS LOS 153 LINKS ⭐⭐
// ---------------------------------------------------------------------

// Ejemplo:
// "https://i.postimg.cc/xxxxxxx/foto1.jpg",

const imagenes = [
  "https://i.postimg.cc/v4wXK3m4/010c3a07ed629565407cf2acaf2c1087.jpg",
  "https://i.postimg.cc/S2PffGP1/20240512-125325.jpg",
  "https://i.postimg.cc/CB2ss422/20240512-125329.jpg",
  "https://i.postimg.cc/jw144h9V/20240516-175323.jpg",
  "https://i.postimg.cc/zbQFFkQs/20240517-175523.jpg",
  "https://i.postimg.cc/MvVm1Vm3/20240517-175616.jpg",
  "https://i.postimg.cc/TLsJJcSM/20240518-170623.jpg",
  "https://i.postimg.cc/9RkYYBSH/20240520-174604.jpg",
  "https://i.postimg.cc/xXGgVMkC/20250724-193652-(1).jpg",
  "https://i.postimg.cc/0M400C3P/20250724-193719-(1).jpg",
  "https://i.postimg.cc/WFyww7Ks/20250724-193822-(1).jpg",
  "https://i.postimg.cc/mtCy7Cy6/20250724-193958-(1).jpg",
  "https://i.postimg.cc/HVX9bX9h/20250726-100135.jpg",
  "https://i.postimg.cc/Pp7QQMcX/20250727-193756-(1).jpg",
  "https://i.postimg.cc/4mVQpVQj/20250727-194226-(1).jpg",
  "https://i.postimg.cc/xXGgVMk8/20250727-194303-(1).jpg",
  "https://i.postimg.cc/fJmfYmv4/20250727-194608-(1).jpg",
  "https://i.postimg.cc/dLrjGrjz/20250727-194915-(1).jpg",
  "https://i.postimg.cc/9rZYyZBH/20250727-195026-(1).jpg",
  "https://i.postimg.cc/2bt77xJz/20250727-204154-(1).jpg",
  "https://i.postimg.cc/0bD07DCx/20250727-204250.jpg",
  "https://i.postimg.cc/9DH1kJfy/20250727-204327-(1).jpg",
  "https://i.postimg.cc/SJCfcCGk/20250727-204402-(1).jpg",
  "https://i.postimg.cc/BXHB2HCn/20250727-204452.jpg",
  "https://i.postimg.cc/zVKFTKkB/20250727-204522.jpg",
  "https://i.postimg.cc/CR0H75vg/20250727-204552-(1).jpg",
  "https://i.postimg.cc/LJSBD5yM/20250828-180738-(1).jpg",
  "https://i.postimg.cc/mP4Njkd4/20250828-180740.jpg",
  "https://i.postimg.cc/FYvgpzPN/20250828-180741-(1).jpg",
  "https://i.postimg.cc/tZcNNzfR/20250828-185108.jpg",
  "https://i.postimg.cc/bD599RMv/20250828-185111.jpg",
  "https://i.postimg.cc/CR0H75vw/20250830-172255-(1).jpg",
  "https://i.postimg.cc/QFZSz0M7/20250830-173615-(1).jpg",
  "https://i.postimg.cc/rDGg2xdz/20250902-171646.jpg",
  "https://i.postimg.cc/zbQFFkMV/20250904-172602-(1).jpg",
  "https://i.postimg.cc/5YrSSmGj/20250904-204055.jpg",
  "https://i.postimg.cc/JDF55QgD/20250904-204115.jpg",
  "https://i.postimg.cc/pmQkMz9p/20250904-204154-(1).jpg",
  "https://i.postimg.cc/QKWk4TGx/20250904-204221-(1).jpg",
  "https://i.postimg.cc/bS2HCtcv/20250904-204320-(1).jpg",
  "https://i.postimg.cc/1VNcCqh4/20250904-204527-(1).jpg",
  "https://i.postimg.cc/fS0j29nm/20250904-204602-(1).jpg",
  "https://i.postimg.cc/hQ7bydWx/20250904-204742-(2).jpg",
  "https://i.postimg.cc/RJnQsH57/20250904-204903-(1).jpg",
  "https://i.postimg.cc/XBycHCSK/20250906-180743.jpg",
  "https://i.postimg.cc/ZvyF7dtx/20250906-183557.jpg",
  "https://i.postimg.cc/QKWk4TGb/20250906-183633.jpg",
  "https://i.postimg.cc/0KJdWwRc/20250906-183704.jpg",
  "https://i.postimg.cc/N2r7JHqN/20250906-183909-(1).jpg",
  "https://i.postimg.cc/G9BQhZBZ/20250906-183939.jpg",
  "https://i.postimg.cc/hX8MRTJX/20250906-184046.jpg",
  "https://i.postimg.cc/V5SRL3rQ/20250906-184109-(1).jpg",
  "https://i.postimg.cc/21dTNhqL/20250906-184308.jpg",
  "https://i.postimg.cc/k2NwPKVt/20250906-184340-(1).jpg",
  "https://i.postimg.cc/XrKx6dZw/20250906-184410.jpg",
  "https://i.postimg.cc/QFgSZ1Bk/20250906-184428.jpg",
  "https://i.postimg.cc/RW1GxK3R/20250907-174442-(1).jpg",
  "https://i.postimg.cc/bZ0LfkGL/20250907-175951.jpg",
  "https://i.postimg.cc/qNcQHytm/20250907-190002.jpg",
  "https://i.postimg.cc/K4KNvdkb/20250907-190702.jpg",
  "https://i.postimg.cc/Yj43qJGw/20250907-190717.jpg",
  "https://i.postimg.cc/CdZNLWBS/20250907-191204.jpg",
  "https://i.postimg.cc/Bj5NfH8Y/20250907-191213.jpg",
  "https://i.postimg.cc/Bj5NfH8w/20250907-191244-(1).jpg",
  "https://i.postimg.cc/RW1GxK3y/20250907-191300.jpg",
  "https://i.postimg.cc/qtkwJqnQ/20250907-191436.jpg",
  "https://i.postimg.cc/xk05f8Hh/20250907-191459.jpg",
  "https://i.postimg.cc/Y4pRr0Yc/20250907-191531.jpg",
  "https://i.postimg.cc/p92CWr8S/20250907-191559.jpg",
  "https://i.postimg.cc/yJVj1xcC/20250907-191752-(1).jpg",
  "https://i.postimg.cc/gxpqsjMn/20250907-233813.jpg",
  "https://i.postimg.cc/LJSBD5yX/20250907-233847-(1).jpg",
  "https://i.postimg.cc/hXnbsvCQ/20250911-180446-(1).jpg",
  "https://i.postimg.cc/9z4pFvRW/20250911-193653-(1).jpg",
  "https://i.postimg.cc/NKt7DFNr/20250913-173608.jpg",
  "https://i.postimg.cc/068nkjDs/20250914-135237.jpg",
  "https://i.postimg.cc/RWmQdhPK/20250914-172632.jpg",
  "https://i.postimg.cc/QVBbxR9N/20250914-172641-(1).jpg",
  "https://i.postimg.cc/pmvYCr0f/20250914-172643.jpg",
  "https://i.postimg.cc/9D2tb0xP/20250914-173059.jpg",
  "https://i.postimg.cc/ZWmFHnfF/20250914-173106-(1).jpg",
  "https://i.postimg.cc/14gH5Ln5/20250914-173906-(1).jpg",
  "https://i.postimg.cc/XXZ87TGX/20250914-173912-(1).jpg",
  "https://i.postimg.cc/3WyBJP4k/20250914-173920-(1).jpg",
  "https://i.postimg.cc/MXcDKhMc/20250914-174011-(1).jpg",
  "https://i.postimg.cc/mhcw20z1/20250914-174014-(1).jpg",
  "https://i.postimg.cc/TKxq01kc/20250914-174025-(1).jpg",
  "https://i.postimg.cc/9D2tb0xp/20250914-174027-(1).jpg",
  "https://i.postimg.cc/87bd0G3W/20250914-175031.jpg",
  "https://i.postimg.cc/w3tVTSyJ/20250919-174808-(1).jpg",
  "https://i.postimg.cc/yWJPYwgF/20250919-180231.jpg",
  "https://i.postimg.cc/xk05f8Mn/20250919-180549-(1).jpg",
  "https://i.postimg.cc/94Wbm0ZW/20250919-181357-(1).jpg",
  "https://i.postimg.cc/SXydSRCK/20250923-173437.jpg",
  "https://i.postimg.cc/5jZmHnLy/20250926-173026.jpg",
  "https://i.postimg.cc/d74BLFjF/20250926-174414.jpg",
  "https://i.postimg.cc/06cfbv05/20251007-180507.jpg",
  "https://i.postimg.cc/Z01L9VpC/20251007-180511.jpg",
  "https://i.postimg.cc/McdDvwmK/20251009-173850.jpg",
  "https://i.postimg.cc/bdKRG3kG/20251009-173857.jpg",
  "https://i.postimg.cc/d74BLFjL/20251022-180913.jpg",
  "https://i.postimg.cc/WtQ7DXgq/20251022-181117.jpg",
  "https://i.postimg.cc/t7Lz12Wx/20251023-181510.jpg",
  "https://i.postimg.cc/3ynBdhFk/20251023-181518.jpg",
  "https://i.postimg.cc/s1tJBw7W/20251023-181845.jpg",
  "https://i.postimg.cc/v13zcytW/20251023-181932.jpg",
  "https://i.postimg.cc/HJB2Vm9M/20251023-213335.jpg",
  "https://i.postimg.cc/wyMkNrwy/20251024-183056.jpg",
  "https://i.postimg.cc/phrBjSsn/20251024-185435-(1).jpg",
  "https://i.postimg.cc/Wd7mHVK0/20251024-185515-(1).jpg",
  "https://i.postimg.cc/xXPG4Q7K/20251024-185548-(1).jpg",
  "https://i.postimg.cc/nX1KPx5G/20251024-185632-(1).jpg",
  "https://i.postimg.cc/NKx8ztVx/20251024-185731-(1).jpg",
  "https://i.postimg.cc/3kZjch6t/20251024-185803-(1).jpg",
  "https://i.postimg.cc/DScQMhD5/20251024-185841-(1).jpg",
  "https://i.postimg.cc/v4v7Nyjj/20251024-185929-(1).jpg",
  "https://i.postimg.cc/9DBPn2Sn/20251024-190014-(1).jpg",
  "https://i.postimg.cc/CR4CQ0t9/20251024-190039-(1).jpg",
  "https://i.postimg.cc/qg9GtjyX/20251110-170411.jpg",
  "https://i.postimg.cc/njr1mW3B/20251111-175500.jpg",
  "https://i.postimg.cc/wyMkNrwQ/20251113-180018.jpg",
  "https://i.postimg.cc/xqWPktMP/20251114-174802.jpg",
  "https://i.postimg.cc/CdW4Zmk7/20251114-174819.jpg",
  "https://i.postimg.cc/PNBML2Y6/20251114-175235.jpg",
  "https://i.postimg.cc/0zCGBv3L/20251114-180043.jpg",
  "https://i.postimg.cc/jWd6V90g/20251114-180316.jpg",
  "https://i.postimg.cc/XGqg5Psx/20251114-180321.jpg",
  "https://i.postimg.cc/xJ8PmZ65/20251114-202156.jpg",
  "https://i.postimg.cc/jw2hf1Mg/20251115-182901.jpg",
  "https://i.postimg.cc/NLWxypmb/ebb96fd6d0534a4efc5fd31a9d26db0d.jpg",
  "https://i.postimg.cc/68hVmKgN/FB-IMG-1757757086360.jpg",
  "https://i.postimg.cc/5Yymzrsk/file-000000001474620ebe8cd515043bf2d9.png",
  "https://i.postimg.cc/Z01L9VpQ/file-000000004bb4622f99572399aa702691-(1).png",
  "https://i.postimg.cc/rzv9dQx7/file-00000000616c61f8b9543944c019f499.png",
  "https://i.postimg.cc/3WPZynmc/file-00000000ec1061fb8b489c6a502a9413.png",
  "https://i.postimg.cc/QBxgLPGY/Gry-(1).jpg",
  "https://i.postimg.cc/jCGhWZP9/H.jpg",
  "https://i.postimg.cc/DJ0cGNxM/Hh-(1).jpg",
  "https://i.postimg.cc/D8LP1LP6/Hhat.jpg",
  "https://i.postimg.cc/yJYhq54r/IMG-20250727-WA0027-(1).jpg",
  "https://i.postimg.cc/qhqGKF1D/IMG-20250905-WA0033-(1).jpg",
  "https://i.postimg.cc/sQxJWLTL/IMG-20250907-WA0069.jpg",
  "https://i.postimg.cc/jLP4yP4Z/IMG-20250912-WA0056.jpg",
  "https://i.postimg.cc/9R0B9kLs/IMG-20250930-WA0023.jpg",
  "https://i.postimg.cc/2Vh7nh7T/IMG-20251022-WA0037.jpg",
  "https://i.postimg.cc/WFz7Zy5Q/J.jpg",
  "https://i.postimg.cc/Jy43wgVS/Nnn-(1).jpg",
  "https://i.postimg.cc/GBhP0NwV/Screenshot-20250831-165009-Tik-Tok.jpg",
  "https://i.postimg.cc/qhqGKFmf/Screenshot-20250907-185015-Whats-App.jpg",
  "https://i.postimg.cc/xJ8PmZsD/Tg-(1).jpg"
];


// ---------------------------------------------------------------------

const grid = document.getElementById("galeriaGrid");
imagenes.forEach(url => {
  const img = document.createElement("img");
  img.src = url;
  img.onclick = () => abrirVisor(url);
  grid.appendChild(img);
});

function abrirVisor(url){
  const visor = document.getElementById("visor");
  const visorImg = document.getElementById("visorImg");
  visorImg.src = url;
  visor.style.display = "flex";
}

document.getElementById("visor").onclick = (e) => {
  if(e.target.id === "visor") {
    document.getElementById("visor").style.display = "none";
  }
};
