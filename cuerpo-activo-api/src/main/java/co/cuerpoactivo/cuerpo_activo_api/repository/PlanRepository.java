package co.cuerpoactivo.cuerpo_activo_api.repository;

import co.cuerpoactivo.cuerpo_activo_api.model.Plan;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class PlanRepository {

    private final List<Plan> planes = new ArrayList<>();
    private Long siguienteId = 4L;

    public PlanRepository() {
        planes.add(new Plan(1L, "Plan mensual", 1, 120000));
        planes.add(new Plan(2L, "Plan trimestral", 3, 330000));
        planes.add(new Plan(3L, "Plan anual", 12, 1200000));
    }

    public List<Plan> findAll() {
        return planes;
    }

    public Plan findById(Long id) {
        for (Plan plan : planes) {
            if (plan.getId().equals(id)) {
                return plan;
            }
        }
        return null;
    }

    public Plan save(Plan plan) {
        plan.setId(siguienteId);
        siguienteId++;
        planes.add(plan);
        return plan;
    }

    public Plan update(Long id, Plan datosActualizados) {
        for (int i = 0; i < planes.size(); i++) {
            if (planes.get(i).getId().equals(id)) {
                datosActualizados.setId(id);
                planes.set(i, datosActualizados);
                return datosActualizados;
            }
        }
        return null;
    }

    public boolean deleteById(Long id) {
        return planes.removeIf(plan -> plan.getId().equals(id));
    }
}