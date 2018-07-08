package com.example.covfefe.model;

import com.example.covfefe.model.audit.UserDateAudit;
import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "books")
public class Book extends UserDateAudit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String contents;
    private String url;
    private String isbn;
    private String datetime;
    private String[] authors;
    private String publisher;
    private String[] translators;
    private int price;
    private int sale_price;
    //    private boolean sale_yn;
    private String sale_yn;
    private String category;
    private String thumbnail;
    private String barcode;
    private String ebook_barcode;
    private String status;

}
