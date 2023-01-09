package ch.supsi.model;

import javax.persistence.*;

@MappedSuperclass
public abstract class UneceModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected Long id;

    @Column(nullable = true)
    private Long expired = null;

    public Long getId() {
        return id;
    }

    public void expire() {
        this.expired = System.currentTimeMillis();
    }

    public void unexpire() {
        this.expired = null;
    }

    public Boolean isExpired() {
        return this.expired != null;
    }
}
