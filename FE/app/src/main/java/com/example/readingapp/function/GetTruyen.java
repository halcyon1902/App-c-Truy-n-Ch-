package com.example.readingapp.function;

import android.annotation.SuppressLint;
import android.app.AlertDialog;
import android.app.Dialog;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.Window;
import android.view.WindowManager;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.readingapp.R;
import com.example.readingapp.adapter.ChapterAdapter;
import com.example.readingapp.adapter.TacGiaAdapter;
import com.example.readingapp.adapter.TheLoaiAdapter;
import com.example.readingapp.api.ApiService;
import com.example.readingapp.model.Chapter;
import com.example.readingapp.model.TacGia;
import com.example.readingapp.model.TaiKhoan;
import com.example.readingapp.model.TheLoai;
import com.example.readingapp.model.Truyen;
import com.squareup.picasso.Picasso;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class GetTruyen extends AppCompatActivity {
    private static final String MY_PREFERENCE_NAME = "USER_ID";
    private final Context context = this;
    String id = null;
    private TextView tvTenTruyen, tvTinhTrang, tv_luotxem, tvLike, tvNoiDung, tvTongChuong;
    private ImageView imgAnhBia, imgAnhNen, fav;
    private RecyclerView rcvTheLoai, rcvTacGia, rcvChapter;
    private List<String> listIDTheLoai, listIDTacGia;
    private List<TheLoai> listTheLoai;
    private List<TacGia> listTacGia;
    private List YeuThich;
    private List LichSu;
    private ChapterAdapter chapterAdapter;
    private boolean isfav = true;
    private boolean isID = true;

    List<Chapter> mlistChapter;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setFullScreen();
        setContentView(R.layout.activity_get_truyen);
        SharedPreferences sharedPreferences = getSharedPreferences(MY_PREFERENCE_NAME, MODE_PRIVATE);
        id = sharedPreferences.getString("value", "");
        // lấy intent
        Intent intent = getIntent();
        Truyen truyen = (Truyen) intent.getSerializableExtra("clickTruyen");
        init();
        listIDTheLoai = new ArrayList<>();
        listTheLoai = new ArrayList<>();
        listIDTacGia = new ArrayList<>();
        listTacGia = new ArrayList<>();
        initLinearLayout();
    }

    private void check(String id) {
        if (id.equals("")) {
            Dialog();
            isID = false;
        } else {
            ApiService.apiService.thongtintaikhoan(id).enqueue(new Callback<TaiKhoan>() {
                @Override
                public void onResponse(@NonNull Call<TaiKhoan> call, @NonNull Response<TaiKhoan> response) {
                    TaiKhoan taiKhoan = response.body();
                    if (taiKhoan != null) {
                        if (!taiKhoan.isTrangThai()) {
                            Dialog3();
                            isID = false;
                        } else {
                            isID = true;
                            LichSu = taiKhoan.getLichSu();
                            YeuThich = taiKhoan.getYeuThich();
                        }
                    }
                }

                @Override
                public void onFailure(@NonNull Call<TaiKhoan> call, @NonNull Throwable t) {
                    Log.e("Thông tin tài khoản: ", t.toString());
                }
            });
        }
    }


    private void initLinearLayout() {
        LinearLayoutManager linearLayoutManager = new LinearLayoutManager(this, RecyclerView.HORIZONTAL, false);
        GridLayoutManager gridLayoutManager = new GridLayoutManager(this, 3);
        LinearLayoutManager linearLayoutManager2 = new LinearLayoutManager(this);
        rcvTheLoai.setLayoutManager(gridLayoutManager);
        rcvTacGia.setLayoutManager(linearLayoutManager);
        rcvChapter.setLayoutManager(linearLayoutManager2);
    }


    private void setFullScreen() {
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
    }

    private void init() {
        tvTenTruyen = findViewById(R.id.tv_ten_truyen);
        fav = findViewById(R.id.btn_fav);
        tvTinhTrang = findViewById(R.id.tv_tinhtrang_truyen);
        tv_luotxem = findViewById(R.id.tv_luotxem);
        tvLike = findViewById(R.id.tv_like);
        tvNoiDung = findViewById(R.id.tv_noi_dung_truyen);
        tvTongChuong = findViewById(R.id.tv_tong_chapter);
        imgAnhBia = findViewById(R.id.manga_cover);
        imgAnhNen = findViewById(R.id.backdrop);
        rcvTheLoai = findViewById(R.id.rcv_The_Loai);
        rcvTacGia = findViewById(R.id.rcv_tac_gia);
        rcvChapter = findViewById(R.id.rcv_chapter);
    }

    private void Dialog() {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setMessage("Tài khoản chưa đăng nhập")
                .setIcon(R.drawable.ic_notifications_red)
                .setTitle("Thông báo");
        builder.setPositiveButton("OK", (dialog, which) -> {
            Intent intent = new Intent(((Dialog) dialog).getContext(), SignIn.class);
            startActivity(intent);
            finish();
        });
        AlertDialog dialog = builder.create();
        dialog.show();
    }

    private void Dialog3() {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setMessage("Tài khoản đã bị đóng băng! Xin liên hệ quản trị viên ")
                .setIcon(R.drawable.ic_notifications_red)
                .setTitle("Thông báo");
        builder.setPositiveButton("OK", (dialog, which) -> {
        });
        AlertDialog dialog = builder.create();
        dialog.show();
    }
}