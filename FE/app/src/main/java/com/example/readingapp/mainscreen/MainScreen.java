package com.example.readingapp.mainscreen;

import android.os.Bundle;
import android.view.MenuItem;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import com.example.readingapp.R;
import com.example.readingapp.ui.TaiKhoanFragment;
import com.example.readingapp.ui.TheoDoiFragment;
import com.example.readingapp.ui.TrangChuFragment;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.google.android.material.navigation.NavigationBarView;

public class MainScreen extends AppCompatActivity {
    BottomNavigationView bottomNavigationView;
    TrangChuFragment trangChuFragment = new TrangChuFragment();
    TheoDoiFragment theoDoiFragment = new TheoDoiFragment();
    TaiKhoanFragment taiKhoanFragment = new TaiKhoanFragment();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main_screen);
        bottomNavigationView = findViewById(R.id.bottom_navigation_view);
        getSupportFragmentManager().beginTransaction().replace(R.id.container, trangChuFragment).commit();
        bottomNavigationView.setOnItemSelectedListener(new NavigationBarView.OnItemSelectedListener() {
            @Override
            public boolean onNavigationItemSelected(@NonNull MenuItem item) {
                switch (item.getItemId()) {
                    case R.id.menu_trangchu:
                        getSupportFragmentManager().beginTransaction().replace(R.id.container, trangChuFragment).commit();
                        return true;
                    case R.id.menu_theodoi:
                        getSupportFragmentManager().beginTransaction().replace(R.id.container, theoDoiFragment).commit();
                        return true;
                    case R.id.menu_taikhoan:
                        getSupportFragmentManager().beginTransaction().replace(R.id.container, taiKhoanFragment).commit();
                        return true;
                }
                return false;
            }
        });

    }
}