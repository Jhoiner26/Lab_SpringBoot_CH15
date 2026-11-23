package co.cuerpoactivo.cuerpo_activo_api.service;

import co.cuerpoactivo.cuerpo_activo_api.model.Plan;
import co.cuerpoactivo.cuerpo_activo_api.repository.PlanRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PlanService {

    private final PlanRepository planRepository;

    public PlanService(PlanRepository planRepository) {
        this.planRepository = planRepository;
    }

    public List<Plan> listarPlanes() {
        return planRepository.findAll();
    }

    public Plan obtenerPlanPorId(Long id) {
        return planRepository.findById(id);
    }

    public Plan crearPlan(Plan plan) {
        validarDatosPlan(plan);
        return planRepository.save(plan);
    }

    public Plan actualizarPlan(Long id, Plan planActualizado) {
        validarDatosPlan(planActualizado);
        return planRepository.update(id, planActualizado);
    }

    public boolean eliminarPlan(Long id) {
        return planRepository.deleteById(id);
    }

    private void validarDatosPlan(Plan plan) {
        if (plan == null) {
            throw new IllegalArgumentException("Los datos del plan son obligatorios");
        }
        if (plan.getNombre() == null || plan.getNombre().isBlank()) {
            throw new IllegalArgumentException("El nombre del plan es obligatorio");
        }
        if (plan.getDuracionMeses() <= 0) {
            throw new IllegalArgumentException("La duración en meses debe ser mayor a 0");
        }
        if (plan.getPrecio() <= 0) {
            throw new IllegalArgumentException("El precio debe ser mayor a 0");
        }
    }
}