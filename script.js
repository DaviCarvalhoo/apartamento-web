let apts = {
  blocoA: [],
  blocoB: [],
  blocoC: []
}

let cBloco = 'blocoA'

const saveToLocalStorage = () => {
  localStorage.setItem('apartamentos', JSON.stringify(apts))
}
const loadFromLocalStorage = () => {
  const storedApts = localStorage.getItem('apartamentos')
  if (storedApts) {
    apts = JSON.parse(storedApts)
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadFromLocalStorage() 
  const defaultButton = document.querySelector('.btn.bloco.active')
  showApts(cBloco, defaultButton) 
})

 

function showApts(bloco, element) {
  document.querySelectorAll('.btn.bloco').forEach(button => {
    button.classList.remove('active')
  })

  element.classList.add('active')
  cBloco = bloco

  const container = document.getElementById('apartamentos')
  container.innerHTML = '' 

  const aptsBloco = apts[bloco] || []
  aptsBloco.forEach(apartamento => addAptsDOM(apartamento, container))
}

function addAptsDOM(apartamento, container) {
  const aptElement = document.createElement('div')
  aptElement.className = `apt-card ${apartamento.color}` 
  aptElement.innerHTML = `<span class="text">${apartamento.morador ? apartamento.morador + ' - ' : ''} <b> Apartamento ${apartamento.id}</b></span>
  <img src="./imgs/${apartamento.color}.svg" alt="${apartamento.color}">`
   
  aptElement.onclick = () => openEditModal(apartamento)
  container.appendChild(aptElement)
}

document.addEventListener('DOMContentLoaded', () => {
  const defaultButton = document.querySelector('.btn.bloco.active')
  showApts(cBloco, defaultButton) 
})

const openAddModal = () => {
  document.getElementById('add-apt-form').reset()
  document.getElementById('modal').classList.add('active')
}
const openEditModal = (apartamento) => {
  document.getElementById('modal-edit').classList.add('active')
  document.getElementById('id').value = apartamento.id
  document.getElementById('old').value = apartamento.id
  document.getElementById('nome').value = apartamento.morador
  document.getElementById('color').value = apartamento.color
}

const closeModal = () => {
  document.getElementById('modal').classList.remove('active')
}
const closeModalEdit = () => {
  document.getElementById('modal-edit').classList.remove('active')
}

document.getElementById('add-apt-form').addEventListener('submit', function (e) {
  e.preventDefault()

  const newAptId = document.getElementById('apt-id').value
  const newMorador = document.getElementById('morador-nome').value
  const selectedBloco = document.getElementById('bloco').value 

  const novoApartamento = {
    id: newAptId,
    morador: newMorador,
    color: 'default' 
  }

  if (selectedBloco in apts) {
    apts[selectedBloco].push(novoApartamento) 
    saveToLocalStorage()
    showApts(selectedBloco, document.querySelector(`button[onclick="showApts('${selectedBloco}', this)"]`))
  } else {
    console.error(`Bloco ${selectedBloco} não encontrado.`)
  }

  closeModal()
})


const removeApt = () => {
  const aptId = document.getElementById('id').value
  const apartamentosBloco = apts[cBloco]
  const aptIndex = apartamentosBloco.findIndex(apt => apt.id == aptId)
  if (aptIndex !== -1) {
    apartamentosBloco.splice(aptIndex, 1)
    showApts(cBloco, document.querySelector(`button[onclick="showApts('${cBloco}', this)"]`))
    saveToLocalStorage()
    closeModalEdit() 
  } else {
    alert('Apartamento não encontrado!')
  }
}

document.getElementById('edit-apt-form').addEventListener('submit', function(e) {
  e.preventDefault()

  const old = document.getElementById('old').value
  const newAptId = document.getElementById('id').value
  const aptNome = document.getElementById('nome').value
  const color = document.getElementById('color').value

  const apartamentosBloco = apts[cBloco]
  const aptIndex = apartamentosBloco.findIndex(apt => apt.id == old)

  if (aptIndex !== -1) {
    apartamentosBloco[aptIndex].id = newAptId
    apartamentosBloco[aptIndex].morador = aptNome
    apartamentosBloco[aptIndex].color = color

    showApts(cBloco, document.querySelector(`button[onclick="showApts('${cBloco}', this)"]`))
    saveToLocalStorage()
    closeModalEdit()
  } else {
    alert('Apartamento não encontrado no bloco atual!')
  }
})
let notifiedApartments = new Set();
let notificationTimeouts = new Map();

const checkForFillApartments = () => {
  const apartmentsWithFill = document.querySelectorAll('.apt-card.fill');

  apartmentsWithFill.forEach(apartment => {
    const apartmentId = apartment.querySelector('.text b').textContent;
    const currentBlock = cBloco;
    const uniqueKey = `${currentBlock}-${apartmentId}`;

    if (!notifiedApartments.has(uniqueKey)) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          notifiedApartments.add(uniqueKey);
          const timeoutId = setTimeout(() => {
            new Notification(`Alarme! O apartamento ${apartmentId} no bloco ${currentBlock} está a 20 minutos ligado!`);
            notifiedApartments.delete(uniqueKey);
          }, 20 * 60 * 1000);

          notificationTimeouts.set(uniqueKey, timeoutId);
        }
      });
    }
  });

  const apartmentsWithoutFill = document.querySelectorAll('.apt-card:not(.fill)');
  apartmentsWithoutFill.forEach(apartment => {
    const apartmentId = apartment.querySelector('.text b').textContent;
    const currentBlock = cBloco;
    const uniqueKey = `${currentBlock}-${apartmentId}`;

    if (notifiedApartments.has(uniqueKey)) {
      notifiedApartments.delete(uniqueKey);
      clearTimeout(notificationTimeouts.get(uniqueKey));
      notificationTimeouts.delete(uniqueKey);
    }
  });
}

setInterval(checkForFillApartments, 1000);

document.addEventListener('DOMContentLoaded', () => {
  loadFromLocalStorage();
  const defaultButton = document.querySelector('.btn.bloco.active');
  showApts(cBloco, defaultButton);
});

