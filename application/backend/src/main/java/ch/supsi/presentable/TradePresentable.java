package ch.supsi.presentable;

import ch.supsi.model.position.Position;
import ch.supsi.model.transaction.trade.Trade;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Getter @AllArgsConstructor @NoArgsConstructor
public class TradePresentable {

    private String contractorReferenceNumber;
    private Long documentID;
    private List<PositionPresentable> positions;
    private String contractorName;
    private String contractorEmail;
    private String consigneeName;
    private String documentType;
    private String notes;
    private Date validFrom;
    private Date validUntil;
    private boolean isCertified;

    public TradePresentable(Trade trade, List<Position> positions) {
        this.contractorReferenceNumber = trade.getContractorReferenceNumber();
        this.documentID = trade.getDocument() != null ? trade.getDocument().getId() : null;
        this.positions = positions != null ? positions.stream().map(PositionPresentable::new).collect(Collectors.toList()) : null;
        this.contractorName = trade.getContractor().getCompanyName();
        this.contractorEmail = trade.getContractorEmail();
        this.documentType = trade.getDocumentType().getCode() + " - " + trade.getDocumentType().getName();
        this.notes = trade.getNotes();
        this.validFrom = trade.getValidFrom();
        this.validUntil = trade.getValidUntil();
        this.consigneeName = trade.getConsignee().getCompanyName();
        this.isCertified = false;
    }

    public void setCertified(boolean certified) {
        isCertified = certified;
    }
}
