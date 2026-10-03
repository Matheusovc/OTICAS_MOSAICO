package br.com.oticasmosaico.model;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

/**
 * Dados enviados pelo formulário de agendamento do site (JSON).
 */
public record AgendamentoRequest(

        @NotBlank(message = "Informe seu nome.")
        @Size(min = 2, max = 120, message = "O nome deve ter entre 2 e 120 caracteres.")
        String nome,

        @NotBlank(message = "Informe seu WhatsApp.")
        @Pattern(regexp = "\\d{10,11}", message = "Informe um telefone com DDD, apenas números.")
        String telefone,

        @NotBlank(message = "Informe o interesse.")
        @Size(max = 60)
        String servico,

        @Size(max = 30)
        String periodo,

        @FutureOrPresent(message = "A data preferida não pode estar no passado.")
        LocalDate dataPreferida,

        @Size(max = 600, message = "As observações devem ter no máximo 600 caracteres.")
        String mensagem
) {
}
