package co.cuerpoactivo.cuerpo_activo_api.dto;

import co.cuerpoactivo.cuerpo_activo_api.model.Plan;
import co.cuerpoactivo.cuerpo_activo_api.model.Socio;

public record SocioRequest(
        String nombre,
        Long planId
) {
    public Socio aEntidad(Plan plan) {
        Socio socio = new Socio();
        socio.setNombre(this.nombre);
        socio.setPlan(plan);
        return socio;
    }
}
