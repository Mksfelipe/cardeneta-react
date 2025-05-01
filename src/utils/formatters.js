export function formatarCPF(cpf) {
    cpf = cpf.replace(/\D/g, ""); // Remove tudo que não é número
  
    if (cpf.length <= 3) {
      return cpf;
    } else if (cpf.length <= 6) {
      return cpf.replace(/(\d{3})(\d+)/, "$1.$2");
    } else if (cpf.length <= 9) {
      return cpf.replace(/(\d{3})(\d{3})(\d+)/, "$1.$2.$3");
    } else {
      return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d+)/, "$1.$2.$3-$4");
    }
  }
  