package co.cuerpoactivo.cuerpo_activo_api.model;

public class Plan {

    private Long id;
    private String nombre;
    private int duracionMeses;
    private int precio;

    public Plan() {
    }

    public Plan(Long id, String nombre, int duracionMeses, int precio) {
        this.id = id;
        this.nombre = nombre;
        this.duracionMeses = duracionMeses;
        this.precio = precio;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public int getDuracionMeses() {
        return duracionMeses;
    }

    public void setDuracionMeses(int duracionMeses) {
        this.duracionMeses = duracionMeses;
    }

    public int getPrecio() {
        return precio;
    }

    public void setPrecio(int precio) {
        this.precio = precio;
    }
}