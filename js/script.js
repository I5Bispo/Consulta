const planosFibraCPF = [
    "600MB - R$ 100,00",
    "700MB - R$ 150,00",
    "1 GIGA - R$ 200,00",
    "2 GIGAS - R$ 400,00"
];

const planosFibraCNPJ = [
    "500MB - R$ 89,99",
    "600MB - R$ 94,99",
    "700MB - R$ 99,99",
    "1 GIGA - R$ 199,99",
    "2 GIGAS - R$ 299,99",
    "10 GIGAS - R$ 2.000,00"
];

const planosVivoTotal = [
    "VIVO TOTAL ESSENCIAL (500MB + 20GB Móvel) - R$ 130,00",
    "VIVO TOTAL ULTRA (700MB + 70GB Móvel) - R$ 170,00",
    "TOTAL ULTRA 2 LINHAS (700MB + 2 Linhas 70GB) - R$ 220,00",
    "FAMILIA 3 (700MB + 3 Linhas 180GB) - R$ 330,00",
    "FAMILIA 4 (700MB + 4 Linhas 240GB) - R$ 380,00"
];

const planosVivoPlay = [
    "VIVO PLAY TV AVANÇADO (2 Pontos - 120 Canais) - R$ 170,00",
    "VIVO PLAY TV COMPLETO (4 Pontos - 140 Canais) - R$ 295,00"
];

const radiosTipoDoc = document.getElementsByName('tipoDoc');
const labelDoc = document.getElementById('label-documento');
const camposCPF = document.getElementById('campos-cpf');
const camposCNPJ = document.getElementById('campos-cnpj');
const alertaCNPJ = document.getElementById('alerta-cnpj');
const selectServico = document.getElementById('servico');
const selectPacote = document.getElementById('pacote');
const caixaPacote = document.getElementById('caixa-pacote');
const optVivoTotal = document.getElementById('opt-vivo-total');
const inputDocumento = document.getElementById('documento');

function atualizarPacotes() {
    let tipoSelecionado = document.querySelector('input[name="tipoDoc"]:checked').value;
    let servicoSelecionado = selectServico.value;
    let arrayPlanos = [];

    if (servicoSelecionado === 'Vivo Fibra') {
        arrayPlanos = (tipoSelecionado === 'CPF') ? planosFibraCPF : planosFibraCNPJ;
    } else if (servicoSelecionado === 'Vivo Total') {
        arrayPlanos = planosVivoTotal;
    } else if (servicoSelecionado === 'Vivo Play') {
        arrayPlanos = planosVivoPlay;
    }

    if (servicoSelecionado) {
        caixaPacote.style.display = 'block';
        selectPacote.required = true;
        selectPacote.innerHTML = '<option value="">Selecione o plano exato...</option>';
        arrayPlanos.forEach(plano => {
            let opt = document.createElement('option');
            opt.value = plano;
            opt.textContent = plano;
            selectPacote.appendChild(opt);
        });
    } else {
        caixaPacote.style.display = 'none';
        selectPacote.required = false;
    }
}

radiosTipoDoc.forEach(radio => {
    radio.addEventListener('change', function() {
        if (this.value === 'CPF') {
            labelDoc.textContent = '🧾 Número do CPF:';
            camposCPF.style.display = 'block';
            camposCNPJ.style.display = 'none';
            alertaCNPJ.style.display = 'none';
            optVivoTotal.style.display = 'block';
            inputDocumento.maxLength = 14; 
        } else {
            labelDoc.textContent = '🧾 Número do CNPJ:';
            camposCPF.style.display = 'none';
            camposCNPJ.style.display = 'block';
            alertaCNPJ.style.display = 'block';
            optVivoTotal.style.display = 'none';
            inputDocumento.maxLength = 18; 
            
            if (selectServico.value === 'Vivo Total') {
                selectServico.value = '';
                caixaPacote.style.display = 'none';
            }
        }
        inputDocumento.value = '';
        atualizarPacotes();
    });
});

selectServico.addEventListener('change', atualizarPacotes);

const inputCep = document.getElementById('cep');

function aplicarMascaraTelefone(v) {
    v = v.replace(/\D/g, ''); 
    v = v.replace(/(\d{2})(\d)/, "($1) $2"); 
    v = v.replace(/(\d)(\d{4})$/, "$1-$2"); 
    return v;
}

function aplicarMascaraDoc(v, tipo) {
    v = v.replace(/\D/g, '');
    if (tipo === 'CPF') {
        v = v.substring(0, 11); 
        v = v.replace(/(\d{3})(\d)/, '$1.$2');
        v = v.replace(/(\d{3})(\d)/, '$1.$2');
        v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else {
        v = v.substring(0, 14); 
        v = v.replace(/^(\d{2})(\d)/, '$1.$2');
        v = v.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
        v = v.replace(/\.(\d{3})(\d)/, '.$1/$2');
        v = v.replace(/(\d{4})(\d)/, '$1-$2');
    }
    return v;
}

document.getElementById('tel1').addEventListener('input', e => e.target.value = aplicarMascaraTelefone(e.target.value));
document.getElementById('tel2').addEventListener('input', e => e.target.value = aplicarMascaraTelefone(e.target.value));
document.getElementById('documento').addEventListener('input', e => {
    let tipo = document.querySelector('input[name="tipoDoc"]:checked').value;
    e.target.value = aplicarMascaraDoc(e.target.value, tipo);
});

inputCep.addEventListener('input', e => {
    let v = e.target.value.replace(/\D/g, '');
    e.target.value = v.replace(/^(\d{5})(\d)/, '$1-$2');
});

inputCep.addEventListener('blur', function() {
    let cep = this.value.replace(/\D/g, '');
    if (cep.length === 8) {
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(res => res.json())
        .then(data => {
            if(!data.erro) {
                document.getElementById('rua').value = data.logradouro;
                document.getElementById('cidade').value = data.localidade + ' - ' + data.uf;
                document.getElementById('numero').focus();
            }
        });
    }
});

document.getElementById('form-consulta').addEventListener('submit', function(event) {
    event.preventDefault(); 

    const tipo = document.querySelector('input[name="tipoDoc"]:checked').value;
    const doc = document.getElementById('documento').value;
    
    // VALIDAÇÃO DE QUANTIDADE DE NÚMEROS DO DOCUMENTO
    const numerosDocumento = doc.replace(/\D/g, ''); // Pega apenas os números
    
    if (tipo === "CPF" && numerosDocumento.length < 11) {
        alert("⚠️ Por favor, preencha o CPF completo (11 números).");
        document.getElementById('documento').focus();
        return; // Trava o envio
    }
    
    if (tipo === "CNPJ" && numerosDocumento.length < 14) {
        alert("⚠️ Por favor, preencha o CNPJ completo (14 números).");
        document.getElementById('documento').focus();
        return; // Trava o envio
    }

    const cep = document.getElementById('cep').value;
    const cidade = document.getElementById('cidade').value;
    const rua = document.getElementById('rua').value;
    const num = document.getElementById('numero').value;
    const comp = document.getElementById('complemento').value;
    const tel1 = document.getElementById('tel1').value;
    const tel2 = document.getElementById('tel2').value;
    const email = document.getElementById('email').value;
    const venc = document.getElementById('vencimento').value;
    const pacote = selectPacote.value;

    let mensagem = "";

    if (tipo === "CPF") {
        const nome = document.getElementById('nome').value;
        const mae = document.getElementById('mae').value;
        let dataNascBr = document.getElementById('nascimento').value; 
        if (dataNascBr) dataNascBr = dataNascBr.split('-').reverse().join('/');

        mensagem = `🚀 🛜 *TEMPLATE DE CADASTRO VIVO FIBRA CPF*.\n\n` +
                   `👤 *Nome:* ${nome}\n` +
                   `👵🏼 *Nome da Mãe:* ${mae}\n` +
                   `🧾 *CPF:* ${doc}\n` +
                   `🗓 *Data de Nascimento:* ${dataNascBr}\n\n` +
                   `📭 *CEP:* ${cep}\n` +
                   `📍 *Cidade:* ${cidade}\n` +
                   `🏠 *Rua:* ${rua}\n` +
                   `🏠 *Nº:* ${num}\n` +
                   `🏠 *Complemento:* ${comp}\n\n` +
                   `📱 *Tel1:* ${tel1}\n`;
        
        if (tel2 && tel2.trim() !== "") {
            mensagem += `📱 *Tel2:* ${tel2}\n`;
        }

        mensagem += `\n📧 *Email:* ${email}\n` +
                    `🧾 *Data de vencimento:* ${venc}\n\n` +
                    `🛜 *Pacote escolhido:* ${pacote}`;
    } else {
        const razao = document.getElementById('razao').value;

        mensagem = `🚀 🛜 *TEMPLATE DE CADASTRO VIVO FIBRA CNPJ*.\n\n` +
                   `🏢 *Empresa:* ${razao}\n` +
                   `🧾 *CNPJ:* ${doc}\n\n` +
                   `📭 *CEP:* ${cep}\n` +
                   `📍 *Cidade:* ${cidade}\n` +
                   `🏠 *Rua:* ${rua}\n` +
                   `🏠 *Nº:* ${num}\n` +
                   `🏠 *Complemento:* ${comp}\n\n` +
                   `📱 *Tel1:* ${tel1}\n`;

        if (tel2 && tel2.trim() !== "") {
            mensagem += `📱 *Tel2:* ${tel2}\n`;
        }

        mensagem += `\n📧 *Email:* ${email}\n` +
                    `🧾 *Data de vencimento:* ${venc}\n\n` +
                    `🛜 *Pacote escolhido:* ${pacote}\n\n` +
                    `📸 *ATENÇÃO:* Lembre-se de anexar a foto FRENTE e VERSO do RG ou CNH do representante legal nesta conversa!`;
    }

    const seuNumero = "5511954873871"; 
    const urlWhatsApp = `https://wa.me/${seuNumero}?text=${encodeURIComponent(mensagem)}`;
    window.open(urlWhatsApp, '_blank');
});