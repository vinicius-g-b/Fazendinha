// Configuração das sementes, preços e tempos (em milissegundos)
const config = {
    carrot: { id: 'carrot', icon: '🥕', buy: 2, sell: 8, growTime: 3000 },
    corn: { id: 'corn', icon: '🌽', buy: 10, sell: 13, growTime: 5000 },
    tomato: { id: 'tomato', icon: '🍅', buy: 15, sell: 18, growTime: 8000 }
};

let money = 50;
let inventory = { carrot: 0, corn: 0, tomato: 0 };
let selectedSeed = null;

const moneyEl = document.getElementById('money');
const messageEl = document.getElementById('message');
const farmEl = document.getElementById('farm');
const seedButtons = document.querySelectorAll('.seed-select');
const sellButton = document.getElementById('sell-button');

// Atualiza o dinheiro na tela
function updateMoney() {
    moneyEl.textContent = money;
}

// Exibe mensagens de feedback no rodapé
function showMessage(msg) {
    messageEl.textContent = msg;
}

// Lógica de seleção de sementes na loja
seedButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        seedButtons.forEach(b => b.classList.remove('selected')); // Remove seleção anterior
        btn.classList.add('selected'); // Adiciona destaque
        selectedSeed = btn.dataset.seed;
        showMessage(`Semente de ${config[selectedSeed].icon} selecionada. Clique num terreno livre.`);
    });
});

// Geração dinâmica dos terrenos da fazenda (12 quadrados)
for (let i = 0; i < 12; i++) {
    const plot = document.createElement('div');
    plot.classList.add('plot');
    plot.dataset.state = 'empty'; // Estados possíveis: empty, growing, ready
    
    plot.addEventListener('click', () => handlePlotClick(plot));
    farmEl.appendChild(plot);
}

// Lógica de clique nos terrenos
function handlePlotClick(plot) {
    const state = plot.dataset.state;

    if (state === 'empty') {
        if (!selectedSeed) {
            showMessage("Selecione uma semente na loja primeiro!");
            return;
        }

        const seedData = config[selectedSeed];
        
        // Verifica se tem saldo
        if (money >= seedData.buy) {
            money -= seedData.buy;
            updateMoney();
            
            // Planta a semente
            plot.dataset.state = 'growing';
            plot.dataset.seed = selectedSeed;
            plot.textContent = '🌱';
            showMessage("Semente plantada! Aguarde crescer.");

            // Timer de crescimento da planta
            setTimeout(() => {
                plot.dataset.state = 'ready';
                plot.textContent = seedData.icon;
                showMessage("Sua plantação está pronta para colheita!");
            }, seedData.growTime);
            
        } else {
            showMessage("Dinheiro insuficiente!");
        }
    } else if (state === 'ready') {
        // Lógica de colheita
        const seedId = plot.dataset.seed;
        inventory[seedId]++; // Adiciona ao inventário oculto
        
        // Reseta o terreno
        plot.dataset.state = 'empty';
        plot.dataset.seed = '';
        plot.textContent = '';
        showMessage(`Você colheu ${config[seedId].icon}! Clique em "Vender tudo" para ganhar moedas.`);
    } else if (state === 'growing') {
        showMessage("A planta ainda está crescendo...");
    }
}

// Lógica para vender as colheitas acumuladas
sellButton.addEventListener('click', () => {
    let totalGanhos = 0;
    let itensVendidos = 0;

    for (const [seed, amount] of Object.entries(inventory)) {
        if (amount > 0) {
            totalGanhos += amount * config[seed].sell;
            inventory[seed] = 0; // Zera a quantidade dessa semente no inventário
            itensVendidos += amount;
        }
    }

    if (itensVendidos > 0) {
        money += totalGanhos;
        updateMoney();
        showMessage(`Você vendeu ${itensVendidos} itens e ganhou ${totalGanhos} moedas! 💰`);
    } else {
        showMessage("Seu inventário está vazio. Colha algo primeiro antes de vender!");
    }
});

// Inicialização
updateMoney();