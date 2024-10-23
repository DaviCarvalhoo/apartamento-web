let apts = {
  blocoA: [
    { id: 101, morador: "Davi", color: "full" },
    { id: 102, morador: "Davi Carvalho Alves", color: "default" },
  ],
  blocoB: [
    { id: 201, morador: "Davi", color: "medium" },
  ],
  blocoC: [
    { id: 301, morador: "Davi", color: "low" },
  ]
};

let cBloco = 'blocoA';
let cApt = null;

function showApts(bloco, element) {
  document.querySelectorAll('.btn.bloco').forEach(button => {
    button.classList.remove('active');
  });

  element.classList.add('active');
  cBloco = bloco;

  const container = document.getElementById('apartamentos');
  container.innerHTML = ''; 

  const aptsBloco = apts[bloco] || [];
  aptsBloco.forEach(apartamento => addAptsDOM(apartamento, container));
}

function addAptsDOM(apartamento, container) {
  const aptElement = document.createElement('div');
  aptElement.className = `apt-card ${apartamento.color}`; 
  aptElement.innerHTML = `<span class="text">${apartamento.morador} - Apartamento ${apartamento.id}</span>
  <img src="./imgs/${apartamento.color}.png" alt="${apartamento.color}">`;
  container.appendChild(aptElement); 
}

document.addEventListener('DOMContentLoaded', () => {
  const defaultButton = document.querySelector('.btn.bloco.active');
  showApts(cBloco, defaultButton); 
});

const openAddModal = () => {
  document.getElementById('modal').classList.add('active');
}
const closeModal = () => {
  document.getElementById('modal').classList.remove('active');
}
