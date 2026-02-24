package com.example.gestion.des.stagiaires.entity;

import com.example.gestion.des.stagiaires.enums.NIVEAU;
import com.example.gestion.des.stagiaires.enums.STATUT;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@Entity
@Getter
@Setter
@Table(name = "sujet_pfe")
public class SujetPfe {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String titre;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String mission;

    @Column(nullable = false)
    private String specialite;

    @Column(nullable = false)
    private String competencesRequises;

    @Column(nullable = false)
    private int nombreStagiaires;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NIVEAU niveauAcademique;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private STATUT statut;

    @Builder.Default
    private Boolean archive = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "departement_id", nullable = false)
    private Departement departement;

    @Column(updatable = false)
    private LocalDateTime dateCreation;

    private LocalDateTime dateModification;

    @PrePersist
    protected void onCreate() {
        dateCreation = LocalDateTime.now();
        dateModification = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        dateModification = LocalDateTime.now();
    }
}
