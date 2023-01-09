//package ch.supsi.controller;
//
//import ch.supsi.service.CoreService;
//import ch.supsi.service.LoginService;
//import ch.supsi.service.VoucherService;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//@RestController
//@RequestMapping("/vouchers")
//public class VoucherController {
//
//    private final VoucherService voucherService;
//
//    private final CoreService coreService;
//
//    private final LoginService loginService;
//
//    public VoucherController(VoucherService voucherService, CoreService coreService, LoginService loginService) {
//        this.voucherService = voucherService;
//        this.coreService = coreService;
//        this.loginService = loginService;
//    }
//
////    @PostMapping("/redeem")
////    public String voucherRedeem(@RequestParam(value = "code") String voucherCode) throws UneceException {
////        Voucher v = voucherService.redeemVoucher(voucherCode, loginService.get(UneceServer.getLoggedUsername()).getUser());
////        if (v == null)
////            throw new ResponseStatusException(
////                    HttpStatus.NOT_FOUND, "Voucher code not found", null);
////        return "Voucher redeemed";
////    }
//}
