package ch.supsi.service;

import ch.supsi.model.Country;
import ch.supsi.repository.CountryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CountryService {

    private final CountryRepository countryRepository;

    public CountryService(CountryRepository countryRepository) {
        this.countryRepository = countryRepository;
    }

    public List<Country> getAllCountries() {
        return countryRepository.findAll();
    }

    public Country findByCode(String code){
        return countryRepository.findById(code).get();
    }
}
