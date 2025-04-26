// src/utils/formatters.js

export const formatarCPF = (value) => {
    // Remove todos os caracteres não numéricos
    value = value.replace(/\D/g, "");
    // Adiciona a máscara
    if (value.length <= 3) {
        return value;
    }
    if (value.length <= 6) {
        return value.replace(/(\d{3})(\d{1,3})/, "$1.$2");
    }
    if (value.length <= 9) {
        return value.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3");
    }
    return value.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, "$1.$2.$3-$4");
};
