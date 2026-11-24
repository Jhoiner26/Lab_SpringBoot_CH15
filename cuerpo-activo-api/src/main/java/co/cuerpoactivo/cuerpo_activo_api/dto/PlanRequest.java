package co.cuerpoactivo.cuerpo_activo_api.dto;

import co.cuerpoactivo.cuerpo_activo_api.model.Plan;

public record PlanRequest(
        String nombre,
        int duracionMeses,
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
