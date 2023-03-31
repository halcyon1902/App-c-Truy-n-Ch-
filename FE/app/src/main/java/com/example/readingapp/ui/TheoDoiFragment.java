package com.example.readingapp.ui;

import static android.content.Context.MODE_PRIVATE;

import android.app.AlertDialog;
import android.app.Dialog;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.WindowManager;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.readingapp.R;
import com.example.readingapp.adapter.TruyenAdapter;
import com.example.readingapp.api.ApiService;
import com.example.readingapp.mainscreen.MainScreen;
import com.example.readingapp.model.TaiKhoan;
import com.example.readingapp.model.Truyen;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class TheoDoiFragment extends Fragment {
    private static final String MY_PREFERENCE_NAME = "USER_ID";
    String id = null;
    private RecyclerView recyclerView;
    private TruyenAdapter truyenTranhAdapter;
    private List<Truyen> listTruyen;
    private List<Truyen> list = new ArrayList<>();

    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view;
        view = inflater.inflate(R.layout.fragment_theo_doi, container, false);
        SharedPreferences sharedPreferences = getActivity().getSharedPreferences(MY_PREFERENCE_NAME, MODE_PRIVATE);
        id = sharedPreferences.getString("value", "");
        check(id);
        init(view);
        GridLayoutManager gridLayoutManager = new GridLayoutManager(getContext(), 3);
        recyclerView.setLayoutManager(gridLayoutManager);
        recyclerView.setNestedScrollingEnabled(false);
        recyclerView.setFocusable(false);
        return view;
    }

    private void check(String id) {
        ApiService.apiService.thongtintaikhoan(id).enqueue(new Callback<TaiKhoan>() {
            @Override
            public void onResponse(@NonNull Call<TaiKhoan> call, @NonNull Response<TaiKhoan> response) {
                TaiKhoan taiKhoan = response.body();
                if (taiKhoan != null) {
                    if (!taiKhoan.isTrangThai()) {
                        Dialog3();
                    } else {
                        GetTruyen();
                    }
                }
            }

            @Override
            public void onFailure(@NonNull Call<TaiKhoan> call, @NonNull Throwable t) {
                Log.e("Thông tin tài khoản: ", t.toString());
            }
        });
    }

    private void init(View view) {
        recyclerView = view.findViewById(R.id.rcv_yeuthich);
    }

    private void GetTruyen() {
        ApiService.apiService.thongtintaikhoan(id).enqueue(new Callback<TaiKhoan>() {
            @Override
            public void onResponse(@NonNull Call<TaiKhoan> call, @NonNull Response<TaiKhoan> response) {
                TaiKhoan taiKhoan = response.body();
                List YeuThich = taiKhoan.getYeuThich();
                ApiService.apiService.GetTatCaTruyen().enqueue(new Callback<List<Truyen>>() {
                    @Override
                    public void onResponse(@NonNull Call<List<Truyen>> call, @NonNull Response<List<Truyen>> response) {
                        listTruyen = response.body();
                        if (listTruyen != null) {
                            for (int i = 0; i < listTruyen.size(); i++) {
                                for (int j = 0; j < YeuThich.size(); j++) {
                                    if (listTruyen.get(i).get_id().equals(YeuThich.get(j))) {
                                        list.add(listTruyen.get(i));
                                    }
                                }
                            }
                            if (list.size() == 0) {
                                Dialog();
                            }
                            truyenTranhAdapter = new TruyenAdapter(getContext(), list);
                            recyclerView.setAdapter(truyenTranhAdapter);
                        }
                    }

                    @Override
                    public void onFailure(@NonNull Call<List<Truyen>> call, @NonNull Throwable t) {
                        Log.e("Lỗi: ", t.toString());
                    }
                });
            }

            @Override
            public void onFailure(@NonNull Call<TaiKhoan> call, @NonNull Throwable t) {
                Log.e("Lỗi: ", t.toString());
            }
        });
    }

    private void Dialog() {
        AlertDialog.Builder builder = new AlertDialog.Builder(getContext());
        builder.setMessage("Chưa có truyện yêu thích! Quay về trang chủ")
                .setIcon(R.drawable.ic_notifications_red)
                .setTitle("Thông báo");
        builder.setPositiveButton("OK", (dialog, which) -> {
            Intent intent = new Intent(((Dialog) dialog).getContext(), MainScreen.class);
            startActivity(intent);
        });
        AlertDialog dialog = builder.create();
        dialog.show();
    }

    private void Dialog3() {
        AlertDialog.Builder builder = new AlertDialog.Builder(getContext());
        builder.setMessage("Tài khoản đã bị đóng băng! Xin liên hệ quản trị viên ")
                .setIcon(R.drawable.ic_notifications_red)
                .setTitle("Thông báo");
        builder.setPositiveButton("OK", (dialog, which) -> {
            Intent intent = new Intent(((Dialog) dialog).getContext(), MainScreen.class);
            startActivity(intent);
        });
        AlertDialog dialog = builder.create();
        dialog.show();
    }
}
