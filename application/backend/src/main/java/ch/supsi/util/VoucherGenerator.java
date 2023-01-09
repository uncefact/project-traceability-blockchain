//package ch.supsi.util;
//
//import java.util.Random;
//
//public class VoucherGenerator {
//    private VoucherGenerator(){}
//
//    private static String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
//
//    public static String generate(Integer length) {
//        Random random = new Random();
//        String result = "";
//        for(int i=0;i<length;i++)
//        {
//            int index = random.nextInt(chars.length());
//            result += chars.charAt(index);
//        }
//
//        return result;
//    }
//}
