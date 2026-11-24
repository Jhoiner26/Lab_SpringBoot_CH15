package co.cuerpoactivo.cuerpo_activo_api.service;

import co.cuerpoactivo.cuerpo_activo_api.dto.PlanRequest;
import co.cuerpoactivo.cuerpo_activo_api.model.Plan;
import co.cuerpoactivo.cuerpo_activo_api.repository.PlanRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PlanService {

    private final PlanRepository planRepository;

    public PlanService(PlanRepository planRepository) {
        this.planRepository = planRepository;
    }

    public List<Plan> listarPlanes() {
        return planRepository.findAll();
    }

    public Optional<Plan> buscarPorId(Long id) {
        return planRepository.findById(id);
    }

    public Plan crear(PlanRequest request) {
        validarDatos(request);
        Plan nuevo = request.aEntidad();
        nuevo.setId(null);
        return planRepository.save(nuevo);
    }

    public Optional<Plan> actualizar(Long id, PlanRequest cambios) {
        validarDatos(cambios);
        return planRepository.findById(id).map(existente -> {
            existente.setNombre(cambios.nombre());
            existente.setDuracionMeses(cambios.duracionMeses());
            existente.setPrecio(cambios.precio());
            return planRepository.save(existente);
        });
    }

    public boolean eliminar(Long id) {
        if (!planRepository.existsById(id)) {
            return false;
        }
        planRepository.deleteById(id);
        return true;
    }

    private void validarDatos(PlanRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Los datos del plan son obligatorios");
        }
        if (request.nombre() == null || request.nombre().isBlank()) {
            throw new IllegalArgumentException("El nombre del plan es obligatorio");
        }
        if (request.duracionMeses() <= 0) {
            throw new IllegalArgumentException("La duración en meses debe ser mayor a 0");
        }
        if (request.precio() <= 0) {
            throw new IllegalArgumentException("El precio debe ser mayor a 0");
        }
    }
}
