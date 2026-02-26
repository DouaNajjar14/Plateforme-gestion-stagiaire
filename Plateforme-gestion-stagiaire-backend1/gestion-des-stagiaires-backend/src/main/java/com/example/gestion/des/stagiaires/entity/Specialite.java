package com.example.gestion.des.stagiaires.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Getter
@Setter
@Table(name = "specialites")
public class Specialite {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nom;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "departement_id", nullable = false)
    private Departement departement;

    @ManyToMany
    @JoinTable(
        name = "specialite_competences",
        joinColumns = @JoinColumn(name = "specialite_id"),
        inverseJoinColumns = @JoinColumn(name = "competence_id")
    )
    @Builder.Default
    private Set<Competence> competences = new HashSet<>();
}
