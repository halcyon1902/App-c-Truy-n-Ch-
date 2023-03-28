package com.example.readingapp.api;

import com.example.readingapp.model.TaiKhoan;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.util.List;

import okhttp3.OkHttpClient;
import retrofit2.Call;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.PUT;
import retrofit2.http.Path;

public interface ApiService {
    Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd HH:mm:ss").create();
    OkHttpClient http = new OkHttpClient().newBuilder().build();
    ApiService apiService = new Retrofit.Builder()
            .baseUrl("http://192.168.1.6:8000/")
            //.baseUrl("https://manga.herokuapp.com/")
            .addConverterFactory(GsonConverterFactory.create(gson))
            .client(http)
            .build()
            .create(ApiService.class);

    //Tài khoản
    @GET("TaiKhoan")
    Call<List<TaiKhoan>> GetTaiKhoan();

    @POST("TaiKhoan")
    Call<TaiKhoan> PostTaiKhoan(@Body TaiKhoan taiKhoan);

    @GET("TaiKhoan/{id}")
    Call<TaiKhoan> thongtintaikhoan(@Path("id") String ID);

    @PUT("TaiKhoan/{id}")
    Call<TaiKhoan> updateTaiKhoan(@Path("id") String ID, @Body TaiKhoan updateTaiKhoan);

    @POST("TaiKhoan/login")
    Call<TaiKhoan> Login(@Body TaiKhoan taiKhoan);

    @PUT("TaiKhoan/UpdateMatKhau/{id}")
    Call<TaiKhoan> updateMatKHau(@Path("id") String ID, @Body TaiKhoan taiKhoan);
}
