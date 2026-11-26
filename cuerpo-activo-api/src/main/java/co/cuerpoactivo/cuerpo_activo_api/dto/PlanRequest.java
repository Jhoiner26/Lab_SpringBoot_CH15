package co.cuerpoactivo.cuerpo_activo_api.dto;

import co.cuerpoactivo.cuerpo_activo_api.model.Plan;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public record PlanRequest(
        @NotBlank(message = "El nombre es obligatorio")
        String nombre,
        @Positive(message = "La duración debe ser mayor que cero")
        int duracionMeses,
        @Positive(message = "El precio debe ser mayor que cero")
        int precio
) {
    public Plan aEntidad() {
        Plan plan = new Plan();
        plan.setNombre(this.nombre);
        plan.setDuracionMeses(this.duracionMeses);
        plan.setPrecio(this.precio);
        return plan;
    }
}
