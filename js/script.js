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

// Melhoria: Tratamento de erros e feedback no ViaCEP
inputCep.addEventListener('blur', function() {
    let cep = this.value.replace(/\D/g, '');
    if (cep.length === 8) {
        document.getElementById('cidade').value = "Buscando...";
        
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(res => res.json())
        .then(data => {
            if(!data.erro) {
                document.getElementById('rua').value = data.logradouro;
                document.getElementById('cidade').value = data.localidade + ' - ' + data.uf;
                document.getElementById('numero').focus();
            } else {
                alert("⚠️ CEP não encontrado. Verifique o número digitado.");
                document.getElementById('cidade').value = "";
                document.getElementById('rua').value = "";
            }
        })
        .catch(error => {
            alert("⚠️ Erro ao buscar o CEP. Digite o endereço manualmente.");
            document.getElementById('cidade').value = "";
        });
    }
});

// Melhoria: Funções reais de validação de CPF e CNPJ
function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf == '') return false;
    if (cpf.length != 11 || /^(\d)\1{10}$/.test(cpf)) return false;
    let add = 0;
    for (let i = 0; i < 9; i++) add += parseInt(cpf.charAt(i)) * (10 - i);
    let rev = 11 - (add % 11);
    if (rev == 10 || rev == 11) rev = 0;
    if (rev != parseInt(cpf.charAt(9))) return false;
    add = 0;
    for (let i = 0; i < 10; i++) add += parseInt(cpf.charAt(i)) * (11 - i);
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11) rev = 0;
    if (rev != parseInt(cpf.charAt(10))) return false;
    return true;
}

function validarCNPJ(cnpj) {
    cnpj = cnpj.replace(/[^\d]+/g, '');
    if(cnpj == '') return false;
    if (cnpj.length != 14 || /^(\d)\1{13}$/.test(cnpj)) return false;
    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
    }
    let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(0)) return false;
    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(1)) return false;
    return true;
}

document.getElementById('form-consulta').addEventListener('submit', function(event) {
    event.preventDefault(); 

    const tipo = document.querySelector('input[name="tipoDoc"]:checked').value;
    const doc = document.getElementById('documento').value;
    
    // Melhoria: Validação real do Documento
    if (tipo === "CPF" && !validarCPF(doc)) {
        alert("⚠️ CPF inválido. Por favor, digite um CPF válido.");
        document.getElementById('documento').focus();
        return; 
    }
    
    if (tipo === "CNPJ" && !validarCNPJ(doc)) {
        alert("⚠️ CNPJ inválido. Por favor, digite um CNPJ válido.");
        document.getElementById('documento').focus();
        return; 
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

    const seuNumero = "5511969731382"; 
    const urlWhatsApp = `https://wa.me/${seuNumero}?text=${encodeURIComponent(mensagem)}`;
    
    // Melhoria: window.location.href faz a transição para o app do WhatsApp de forma mais limpa em celulares
    window.location.href = urlWhatsApp;
});
