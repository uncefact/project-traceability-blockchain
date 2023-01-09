package ch.supsi.presentable.SupplyChain;

import ch.supsi.enums.UneceError;
import ch.supsi.exception.UneceException;
import ch.supsi.model.company.Company;
import ch.supsi.model.TraceabilityLevel;

import java.util.Objects;

public class SupplyChainCompanyInfoPresentable {
    private String name;
    private String visibleName;
    private String location;
    private String country;
    private String region;
    private String partnerType;

    public SupplyChainCompanyInfoPresentable(String name, Company company, TraceabilityLevel traceabilityLevel) throws UneceException {
        this.name = name;
        this.partnerType = company.getPartnerType().getName();
        if (traceabilityLevel != null){
            switch (traceabilityLevel.getName().split(" -")[0]){
                case "1":
                    this.country = company.getCountry().getName();
                    break;
                case "2":
                    this.country = company.getCountry().getName();
                    this.region = company.getCity();
                    break;
                case "3":
                    this.visibleName = company.getCompanyName();
                    this.location = company.getAddress1();
                    this.country = company.getCountry().getName();
                    this.region = company.getCity();
                    break;
                default:
                    throw new UneceException(UneceError.INVALID_VALUE, "The Traceability Level " + traceabilityLevel.getName().toUpperCase() + " doesn't exists!");
            }
        }

    }

    public String getName() {
        return name;
    }

    public String getLocation() {
        return location;
    }

    public String getCountry() {
        return country;
    }

    public String getRegion() {
        return region;
    }

    public String getVisibleName() { return visibleName; }

    public String getPartnerType() { return partnerType; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        SupplyChainCompanyInfoPresentable that = (SupplyChainCompanyInfoPresentable) o;
        return Objects.equals(name, that.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name, location, country, region, partnerType);
    }

}
