package com.example.readingapp.function;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
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
import com.example.readingapp.adapter.TheLoaiAdapter;
import com.example.readingapp.api.ApiService;
import com.example.readingapp.model.Chapter;
import com.example.readingapp.model.TheLoai;
import com.example.readingapp.model.Truyen;
import com.squareup.picasso.Picasso;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class GetTruyen extends AppCompatActivity {
    private static final String MY_PREFERENCE_NAME = "USER_ID";
    private final Context context = this;
    String id = null;
    private TextView tvTenTruyen, tvTinhTrang, tvNoiDung, tvTongChuong, txt_tac_gia;
    private ImageView imgAnhBia, imgAnhNen, fav;
    private RecyclerView rcvTheLoai, rcvChapter;
    private List<String> listIDTheLoai;
    private List<TheLoai> listTheLoai;
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
        initLinearLayout();
        hienThiTruyen(truyen);
    }

    private void initLinearLayout() {
        GridLayoutManager gridLayoutManager = new GridLayoutManager(this, 3);
        LinearLayoutManager linearLayoutManager2 = new LinearLayoutManager(this);
        rcvTheLoai.setLayoutManager(gridLayoutManager);
        rcvChapter.setLayoutManager(linearLayoutManager2);
    }

    @SuppressLint("SetTextI18n")
    private void hienThiTruyen(Truyen truyen) {
        if (truyen != null && truyen.isTrangThai()) {
            listIDTheLoai = Arrays.asList(truyen.getTheLoais());
            txt_tac_gia.setText(truyen.getTacGias());
            //mlistChapter = Arrays.asList(truyen.getChapters());
            //Hiển thị thể loại
            for (int i = 0; i < listIDTheLoai.size(); i++) {
                ApiService.apiService.GetTheLoai(listIDTheLoai.get(i)).enqueue(new Callback<TheLoai>() {
                    @Override
                    public void onResponse(@NonNull Call<TheLoai> call, @NonNull Response<TheLoai> response) {
                        TheLoai theLoai = response.body();
                        if (theLoai != null && theLoai.isTrangThai()) {
                            listTheLoai.add(theLoai);
                        }
                        TheLoaiAdapter theLoaiAdapter = new TheLoaiAdapter(listTheLoai, GetTruyen.this);
                        rcvTheLoai.setAdapter(theLoaiAdapter);
                    }

                    @Override
                    public void onFailure(@NonNull Call<TheLoai> call, @NonNull Throwable t) {
                    }
                });
            }

            //hiển thị thông tin truyện
            tvTenTruyen.setText(truyen.getTenTruyen());
            if (truyen.isTrangThai()) {
                tvTinhTrang.setText("Tình trạng: Hoàn thành");
            } else {
                tvTinhTrang.setText("Tình trạng: Đang tiến thành");
            }
            tvNoiDung.setText(truyen.getGioiThieu());
          //  tvTongChuong.setText("Tổng chapter: " + mlistChapter.size());
            Picasso.get().load(truyen.getAnhBia()).into(imgAnhBia);
            Picasso.get().load(truyen.getAnhBia()).into(imgAnhNen);
        }
    }

    private void setFullScreen() {
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
    }

    private void init() {
        tvTenTruyen = findViewById(R.id.tv_ten_truyen);
        fav = findViewById(R.id.btn_fav);
        tvTinhTrang = findViewById(R.id.tv_tinhtrang_truyen);
        tvNoiDung = findViewById(R.id.tv_noi_dung_truyen);
        tvTongChuong = findViewById(R.id.tv_tong_chapter);
        imgAnhBia = findViewById(R.id.manga_cover);
        imgAnhNen = findViewById(R.id.backdrop);
        rcvTheLoai = findViewById(R.id.rcv_The_Loai);
        txt_tac_gia = findViewById(R.id.txt_tac_gia);
        rcvChapter = findViewById(R.id.rcv_chapter);
    }
}