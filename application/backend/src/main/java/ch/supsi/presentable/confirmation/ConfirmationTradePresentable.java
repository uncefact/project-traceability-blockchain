package ch.supsi.presentable.confirmation;

import ch.supsi.model.position.Position;
import ch.supsi.model.transaction.trade.Trade;
import ch.supsi.presentable.PositionPresentable;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Getter @NoArgsConstructor
public class ConfirmationTradePresentable extends ConfirmationTransactionPresentable {
    private List<PositionPresentable> positions;

    public ConfirmationTradePresentable(Trade trade, List<Position> positions) {
        super(trade);
        this.positions = positions != null ? positions.stream().map(PositionPresentable::new).collect(Collectors.toList()) : new ArrayList<>();
    }

}
