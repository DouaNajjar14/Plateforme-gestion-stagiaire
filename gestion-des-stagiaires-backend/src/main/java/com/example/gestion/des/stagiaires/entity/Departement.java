package com.example.gestion.des.stagiaires.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@Entity
@Getter
@Setter
@Table(name = "departements")
public class Departement {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String nom;

    @Builder.Default
    private Boolean archive = false;
}
