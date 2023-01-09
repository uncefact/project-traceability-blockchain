package ch.supsi.core.controller;

import ch.supsi.request.DocumentRequest;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Objects;

public class Utils {

    public static List<DocumentRequest> loadDocumentRequestsFromFiles(String documentsPath) throws IOException {
        File directory = new File(System.getProperty("user.dir") + documentsPath);
        List<DocumentRequest> documentRequests = new ArrayList<>();

        for (File file: Objects.requireNonNull(directory.listFiles())){
            byte[] fileContent = FileUtils.readFileToByteArray(file);
            documentRequests.add(new DocumentRequest(file.getName(), FilenameUtils.getExtension(file.getName()), Base64.getEncoder().encodeToString(fileContent)));
        }
        return documentRequests;
    }
}
