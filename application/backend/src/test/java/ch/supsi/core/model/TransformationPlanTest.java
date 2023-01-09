package ch.supsi.core.model;

import ch.supsi.model.*;
import ch.supsi.model.company.Company;
import ch.supsi.model.transformation_plan.TransformationPlan;

import java.util.Date;

import static org.junit.Assert.*;
import static org.junit.Assert.assertEquals;

public class TransformationPlanTest extends ModelTestTemplate {
    @Override
    public void testConstructor() throws Exception {
        TransformationPlan transformationPlan = new TransformationPlan();
        assertNull(transformationPlan.getId());
        assertNull(transformationPlan.getName());
        assertNull(transformationPlan.getCompany());
        assertNull(transformationPlan.getValidFrom());
        assertNull(transformationPlan.getValidUntil());
        assertNull(transformationPlan.getNotes());
        assertNull(transformationPlan.getDocumentType());
        assertNull(transformationPlan.getCreationDate());
    }

    @Override
    public void testGettersAndSetters() throws Exception {
        TransformationPlan transformationPlan = new TransformationPlan();
        Company company = new Company();
        transformationPlan.setId(1L);
        assertEquals(Long.valueOf(1L), transformationPlan.getId());
        transformationPlan.setCompany(company);
        assertEquals(transformationPlan.getCompany(), company);
        Date date = new Date();
        transformationPlan.setValidFrom(date);
        assertEquals(date, transformationPlan.getValidFrom());
        transformationPlan.setValidUntil(date);
        assertEquals(date, transformationPlan.getValidUntil());
        transformationPlan.setCreationDate(date);
        assertEquals(date, transformationPlan.getCreationDate());
        transformationPlan.setNotes("notes");
        assertEquals(transformationPlan.getNotes(), "notes");
        DocumentType documentType = new DocumentType();
        transformationPlan.setDocumentType(documentType);
        assertEquals(transformationPlan.getDocumentType(), documentType);
        TraceabilityLevel traceabilityLevel = new TraceabilityLevel("TraceabilityLevelTest");
        transformationPlan.setTraceabilityLevel(traceabilityLevel);
        assertEquals(traceabilityLevel, transformationPlan.getTraceabilityLevel());
        TransparencyLevel transparencyLevel = new TransparencyLevel("TransparencyLevelTest");
        transformationPlan.setTransparencyLevel(transparencyLevel);
        assertEquals(transparencyLevel, transformationPlan.getTransparencyLevel());


    }
}
